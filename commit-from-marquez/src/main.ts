import * as core from '@actions/core'
import {Octokit} from '@octokit/rest'
import * as dotenv from 'dotenv'
import fetch from 'node-fetch'

import {createMetaDataFromUrl} from './createmetadata'
import {DataPackage} from './datapackage'
import {AddFileToRepo, listCommmits} from './queries'

interface CommitFile {
  commitName: string
  name: string
  contents: string
}

interface MarquezDataset {
  id: {
    name: string
    namespace: string
  }
}

interface ListOfNamespaces {
  namespaces: Namespace[]
}

interface Namespace {
  name: string
}

async function run(): Promise<void> {
  dotenv.config()
  try {
    const allNamespacesRes = await fetch(
      `${core.getInput('marquez_url')}namespaces`
    )
    const allNamespaces: ListOfNamespaces =
      (await allNamespacesRes.json()) as ListOfNamespaces
    const allDatasets: MarquezDataset[] = (await Promise.all(
      allNamespaces.namespaces.map(async (namespace: {name: string}) => {
        const res = await fetch(
          `${core.getInput('marquez_url')}namespaces/${encodeURIComponent(
            namespace.name
          )}/datasets`
        )
        const dataset = await res.json()
        return dataset
      })
    )) as MarquezDataset[]
    const dataPackages: DataPackage[] = allDatasets
      .reduce((acc: any, curr: any) => acc.concat(curr.datasets), [])
      .map((dataset: any) =>
        createMetaDataFromUrl(
          `${core.getInput(
            'marquez_url'
          )}lineage?nodeId=dataset:${encodeURIComponent(
            dataset.id.namespace
          )}:${encodeURIComponent(dataset.id.name)}`,
          dataset.id.name,
          'data-package'
        )
      )
    const client = new Octokit({auth: core.getInput('github_server_token')})
    const files: CommitFile[] = dataPackages.map(dataPackage => ({
      commitName: dataPackage.name,
      name: `datasets/${dataPackage.name}/datapackage.json`,
      contents: JSON.stringify(dataPackage, null, 2)
    }))
    const commits = await listCommmits(client)
    let currSHA: string = commits.data[0].sha
    files.reduce(async (acc: Promise<string>, currentFile: CommitFile) => {
      const currSHA = await acc
      const newCommitSHA = await AddFileToRepo(
        client,
        [currentFile],
        currentFile.commitName,
        currSHA
      )
      return newCommitSHA
    }, Promise.resolve(currSHA))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
