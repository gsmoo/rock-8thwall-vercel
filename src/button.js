const modelList = [
  {model: 'treeModel', scale: 0.5},
  {model: 'elfosModel', scale: 1.5},
]
let idx = 0

const mod = (number, modulus) => {
  return ((number % modulus) + modulus) % modulus
}

const nextButtonComponent = () => ({
  init() {
    const model = document.getElementById('model')
    const nextButton = document.getElementById('nextbutton')
    const nextModel = () => {
      idx = mod(idx + 1, modelList.length)
      model.removeAttribute('gltf-model')
      // model.removeAttribute('scale')
      const newModel = modelList[idx]
      model.object3D.scale.set(newModel.scale, newModel.scale, newModel.scale)
      model.setAttribute('gltf-model', `#${newModel.model}`)
    }
    nextButton.onclick = nextModel
  },
})

const backButtonComponent = () => ({
  init() {
    const model = document.getElementById('model')
    const nextButton = document.getElementById('backbutton')
    const nextModel = () => {
      idx = mod(idx - 1, modelList.length)
      model.removeAttribute('gltf-model')
      const newModel = modelList[idx]
      model.object3D.scale.set(newModel.scale, newModel.scale, newModel.scale)
      model.setAttribute('gltf-model', `#${newModel.model}`)
    }
    nextButton.onclick = nextModel
  },
})

export {nextButtonComponent, backButtonComponent}
