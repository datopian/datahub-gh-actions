# Datahub GH Actions

The composite actions listed in this repo can be used for a number of porpuses, you can use them inside any repo like this

```
      - name: Get composite run steps repository
        uses: actions/checkout@v2
        with:
          repository: datopian/datahub-gh-actions
          path: .github/datahub-gh-actions
      - name: Run action repo
        uses: ./.github/datahub-gh-actions/index-collections
```

The first step checks out this repo inside the Github action, once that is done you can run the action in the respective directory, in this example the `index-collections` action.

Note that most actions require the existance of one or more environment variables, below a list of the current actions and the environment variables required

## Index datapackage

```
  TYPESENSE_HOST: {A Typesense Host URL}
  TYPESENSE_API_KEY: {A Typesens API Key}
  DATASET_NAME: {The name of the dataset that is going to be indexed }}
  REPO_NAME: {The name of the repo in which the action is being run, you can get that by using "${{ github.event.repository.name }}" }
```

## Index terms

```
  TYPESENSE_HOST: {A Typesense Host URL}
  TYPESENSE_API_KEY: {A Typesens API Key}
  REPO_NAME: {The name of the repo in which the action is being run, you can get that by using "${{ github.event.repository.name }}" }
```

## Index collections

```
  TYPESENSE_HOST: {A Typesense Host URL}
  TYPESENSE_API_KEY: {A Typesens API Key}
  REPO_NAME: {The name of the repo in which the action is being run, you can get that by using "${{ github.event.repository.name }}" }
```

## Validate data

```
  DATASET_NAME: {The name of the dataset that is going to be indexed }}
  REPO_NAME: {The name of the repo in which the action is being run, you can get that by using "${{ github.event.repository.name }}" }
```
