import {Octokit} from '@octokit/rest'
import * as dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()
const repo = {
  GITHUB_ORG: process.env.GITHUB_ORG ? process.env.GITHUB_ORG : '',
  GITHUB_REPO: process.env.GITHUB_REPO ? process.env.GITHUB_REPO : ''
}

export interface File {
  path: string
  mode: '100644' | '100755' | '040000' | '160000' | '120000'
  type: 'commit' | 'tree' | 'blob'
  sha?: string | null
  content: string
}

export async function createLabel(client: Octokit, name: string) {
  try {
    await client.issues.createLabel({
      owner: repo.GITHUB_ORG,
      repo: repo.GITHUB_REPO,
      name
    })
  } catch (e) {
    return
  }
}

export async function getCollectionsGlossary(client: Octokit) {
  const result = await client.request(
    `GET /repos/${repo.GITHUB_ORG}/${repo.GITHUB_REPO}/contents/data-glossary/collections.json`,
    {
      owner: repo.GITHUB_ORG,
      repo: repo.GITHUB_REPO,
      path: 'data-glossary/collections.json'
    }
  )
  const resDownload = await fetch(result.data.download_url)
  const collections = await resDownload.json()
  return collections
}

export async function listCommmits(client: Octokit) {
  const commits = await client.repos.listCommits({
    owner: repo.GITHUB_ORG,
    repo: repo.GITHUB_REPO
  })
  return commits
}

export async function addFiles(
  files: {name: string; contents: string}[],
  client: Octokit,
  CommitSHA: string
) {
  const commitableFiles: File[] = files.map(({name, contents}) => {
    return {
      path: name,
      mode: '100644',
      type: 'commit',
      content: contents
    }
  })
  const {
    data: {sha: currentTreeSHA}
  } = await client.git.createTree({
    owner: repo.GITHUB_ORG,
    repo: repo.GITHUB_REPO,
    tree: commitableFiles,
    base_tree: CommitSHA,
    message: 'Adding test',
    parents: [CommitSHA]
  })
  return currentTreeSHA
}

export async function createCommit(
  client: Octokit,
  currentTreeSHA: string,
  CommitSHA: string,
  packageName: string
) {
  const {
    data: {sha: newCommitSHA}
  } = await client.git.createCommit({
    owner: repo.GITHUB_ORG,
    repo: repo.GITHUB_REPO,
    tree: currentTreeSHA,
    message: packageName,
    parents: [CommitSHA]
  })
  return newCommitSHA
}

export async function pushCommit(client: Octokit, newCommitSHA: string) {
  const pushedCommit = await client.git.updateRef({
    owner: repo.GITHUB_ORG,
    repo: repo.GITHUB_REPO,
    sha: newCommitSHA,
    ref: 'heads/main' // Whatever branch you want to push to
  })
  return pushedCommit
}

export async function getCommitBySHA(client: Octokit, commitSha: string) {
  const commit = await client.rest.git.getCommit({
    owner: repo.GITHUB_ORG,
    repo: repo.GITHUB_REPO,
    commit_sha: commitSha
  })
  return commit
}

export async function AddFileToRepo(
  client: Octokit,
  files: {name: string; contents: string}[],
  packageName: string,
  commitSHA: string
) {
  const currentTreeSHA = await addFiles(files, client, commitSHA)
  const newCommitSHA = await createCommit(
    client,
    currentTreeSHA,
    commitSHA,
    packageName
  )
  await pushCommit(client, newCommitSHA)
  createLabel(client, packageName)
  const commits = await listCommmits(client)
  const currSHA: string = commits.data[0].sha
  return currSHA
}
