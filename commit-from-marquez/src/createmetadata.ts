import slugify from 'slugify'

function makeid(length: number) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function createMetaDataFromUrl(
  urlStr: string,
  name?: string,
  profile?: string
) {
  const url = new URL(urlStr)
  const splitUrl = url.pathname.split('/')
  const fileName =
    url.pathname !== '/'
      ? splitUrl[splitUrl.length - 1]
      : url.hostname.replace('.', '_')
  const re = /(?:\.([^.]+))?$/
  const fileFormat = re.exec(fileName)![1]
  return {
    name: name
      ? name
      : slugify(fileName.replace(/\.[^/.]+$/, ''), '-').toLowerCase(),
    title: name ? name : fileName.replace(/\.[^/.]+$/, ''),
    profile: profile ? profile : 'data-package',
    uuid: makeid(12),
    licenses: [
      {
        name: 'ODC-PDDL-1.0',
        path: 'http://opendatacommons.org/licenses/pddl/',
        title: 'Open Data Commons Public Domain Dedication and License v1.0'
      }
    ],
    resources: [
      {
        format: url.pathname !== '/' ? fileFormat : undefined,
        description: '...',
        path: urlStr,
        name: name
          ? name
          : slugify(fileName.replace(/\.[^/.]+$/, ''), '-').toLowerCase(),
        title: name ? name : fileName.replace(/\.[^/.]+$/, '')
      }
    ]
  }
}
