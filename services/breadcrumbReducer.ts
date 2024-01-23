export interface IBreadcrumb {
  name?: string
  url: string
  position: number
}
interface ITag {
  tag: string
  content: string
}
interface IPageData {
  '@type': string
  itemListElement: IBreadcrumbOriginal[]
}
interface ContentItem {
  '@graph': IPageData[]
}
interface IBreadcrumbOriginal {
  '@type': string
  position: string
  name: string
  item: string
}

const homePage: IBreadcrumb = {
  url: '/',
  name: 'Strona główna',
  position: 0,
};

const parentsMap: Record<string, Array<IBreadcrumb>> = {
  employee: [
    homePage,
    {
      url: '/o-nas',
      name: 'O nas',
      position: 1,
    },
    {
      url: '/o-nas/nasz-zespol',
      name: 'Nasz zespół',
      position: 2,
    },
  ],
  offer: [
    homePage,
    {
      url: '/nasza-oferta',
      name: 'Oferta',
      position: 1,
    },
  ],
};

export function reducerBreadcrumb(
  tagList: ITag[],
  type: string = ''
): IBreadcrumb[] | null {
  const scriptTag = tagList.find((tag: ITag) => tag.tag === 'script')
  
  if (scriptTag) {
    const scriptParsed: ContentItem = JSON.parse(decodeURI(scriptTag.content))
    const breadcrumbData: IPageData | undefined = scriptParsed['@graph'].find(
      (itemtype) => itemtype['@type'] === 'BreadcrumbList'
    )
    
    if (breadcrumbData) {
      const items = breadcrumbData.itemListElement.map(
        (breadcrumb: IBreadcrumbOriginal) => {
          return {
            name:
              breadcrumb.name === 'Home' || breadcrumb.name === 'Dom' 
                ? 'Strona główna'
                : breadcrumb.name,
            url: breadcrumb.item ?? null,
            position: Number(breadcrumb.position),
          }
        }
      )
      return items.sort((item1, item2) => item1.position - item2.position)
    }
  }
  return null
};
