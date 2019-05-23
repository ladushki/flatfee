export const createTree = function (data) {
  const source = []
  const items = []

  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    let name = item['name']
    let parent = item['parent']
    let id = item['name']

    if (items[parent]) {
      item = { name: name, parent: parent, item: item }
      if (!items[parent].items) {
        items[parent].items = []
      }
      items[parent].items[items[parent].items.length] = item
      items[id] = item
    } else {
      items[id] = { parent: parent, name: name, item: item }
      source[id] = items[id]
    }
  }
  return source
}
export const findBranches = function (currentNode, branches = []) {
  let i,
    currentChild

  if (!currentNode.hasOwnProperty('items')) {
    branches.push(currentNode.item)
  } else {
    for (i = 0; i < currentNode.items.length; i += 1) {
      currentChild = currentNode.items[i]
      findBranches(currentChild, branches)
    }
  }
  return branches
}

export const findNodeByName = function (name, data) {
  return data.find(item => item.name === name) || null
}
