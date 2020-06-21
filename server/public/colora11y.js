function submitData(){
  let colorForm = document.getElementById("colorForm").children[0].children[0].children
  let colors = []
  
  for (element in colorForm) {
    if(colorForm[element].id) {
      if (colorForm[element].id.includes("text")){
        colors.push(colorForm[element].value)
      }
    }
  }

  colors.forEach(color => {
    if (color) {
      if(!/^#[0-9A-F]{6}$/i.test(color)) {
        alert("Invalid color hex code! Please supply a valid color hex code")
        console.log(color)
      }
    }
  })

  let color_object = {}
  for (let i = 0; i < colors.length; i++) {
    if (colors[i]) {
      color_object[`c${i+1}`] = colors[i]
    }
  }

  fetch('https://colora11y.herokuapp.com/colors', {
    method: 'POST', 
    body: new URLSearchParams(color_object),
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  })
    .then(response => response.json())
    .then(response => processResponse(response))
}

function submitLink() {
  showSpinner()
  let link = document.getElementById('link').value

  let link_object = {
    "link": link
  }

  fetch('https://colora11y.herokuapp.com/link', {
    method: 'POST', 
    body: new URLSearchParams(link_object),
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  })
    .then(response => response.json())
    .then(response => {
      hideSpinner()
      processResponse(response)})
}

function processResponse(response){
  let deuteranomalyConflicts = response.deuteranomalyConflicts
  let deuteranopiaConflicts = response.deuteranopiaConflicts
  let protanomalyConflicts = response.protanomalyConflicts
  let protanopiaConflicts = response.protanopiaConflicts
  let tritanomalyConflicts = response.tritanomalyConflicts
  let tritanopiaConflicts = response.tritanopiaConflicts

  let conflicts = document.getElementById('conflicts')
  if (conflicts.hasChildNodes()){
    conflicts.innerHTML = ''
  }

  if(deuteranomalyConflicts.length > 0) {
    dly = document.createElement('p')
    dly.innerText = "Users with Deuteranomaly might have trouble differentiating between these colors: "
    conflicts.appendChild(dly)

    deuteranomalyConflicts.forEach(pair => {
      dly_color_one = document.createElement('canvas')
      dly_color_one.width = "100"
      dly_color_one.height = "50"
      dly_color_one.style = `background-color: ${pair[0]}`

      dly_color_two = document.createElement('canvas')
      dly_color_two.width = "100"
      dly_color_two.height = "50"
      dly_color_two.style = `background-color: ${pair[1]}`

      dly.appendChild(dly_color_one)
      dly.appendChild(dly_color_two)
    })
  }

  if(deuteranopiaConflicts.length > 0) {
    dpia = document.createElement('p')
    dpia.innerText = "Users with Deuteranopia might have trouble differentiating between these colors: "
    conflicts.appendChild(dpia)

    deuteranopiaConflicts.forEach(pair => {
      dpia_color_one = document.createElement('canvas')
      dpia_color_one.width = "100"
      dpia_color_one.height = "50"
      dpia_color_one.style = `background-color: ${pair[0]}`

      dpia_color_two = document.createElement('canvas')
      dpia_color_two.width = "100"
      dpia_color_two.height = "50"
      dpia_color_two.style = `background-color: ${pair[1]}`

      dpia.appendChild(dpia_color_one)
      dpia.appendChild(dpia_color_two)
    })
  }

  if(protanomalyConflicts.length > 0) {
    ply = document.createElement('p')
    ply.innerText = "Users with Protanomaly might have trouble differentiating between these colors: "
    conflicts.appendChild(ply)

    protanomalyConflicts.forEach(pair => {
      ply_color_one = document.createElement('canvas')
      ply_color_one.width = "100"
      ply_color_one.height = "50"
      ply_color_one.style = `background-color: ${pair[0]}`

      ply_color_two = document.createElement('canvas')
      ply_color_two.width = "100"
      ply_color_two.height = "50"
      ply_color_two.style = `background-color: ${pair[1]}`

      ply.appendChild(ply_color_one)
      ply.appendChild(ply_color_two)
    })
  }

  if(protanopiaConflicts.length > 0) {
    ppia = document.createElement('p')
    ppia.innerText = "Users with Protanopia might have trouble differentiating between these colors: "
    conflicts.appendChild(ppia)

    protanopiaConflicts.forEach(pair => {
      ppia_color_one = document.createElement('canvas')
      ppia_color_one.width = "100"
      ppia_color_one.height = "50"
      ppia_color_one.style = `background-color: ${pair[0]}`

      ppia_color_two = document.createElement('canvas')
      ppia_color_two.width = "100"
      ppia_color_two.height = "50"
      ppia_color_two.style = `background-color: ${pair[1]}`

      ppia.appendChild(ppia_color_one)
      ppia.appendChild(ppia_color_two)
    })
  }

  if(tritanomalyConflicts.length > 0) {
    tly = document.createElement('p')
    tly.innerText = "Users with Tritanomaly might have trouble differentiating between these colors: "
    conflicts.appendChild(tly)

    tritanomalyConflicts.forEach(pair => {
      tly_color_one = document.createElement('canvas')
      tly_color_one.width = "100"
      tly_color_one.height = "50"
      tly_color_one.style = `background-color: ${pair[0]}`

      tly_color_two = document.createElement('canvas')
      tly_color_two.width = "100"
      tly_color_two.height = "50"
      tly_color_two.style = `background-color: ${pair[1]}`

      tly.appendChild(tly_color_one)
      tly.appendChild(tly_color_two)
    })
  }

  if(tritanopiaConflicts.length > 0) {
    trpia = document.createElement('p')
    trpia.innerText = "Users with Tritanopia might have trouble differentiating between these colors: "
    conflicts.appendChild(trpia)

    tritanopiaConflicts.forEach(pair => {
      trpia_color_one = document.createElement('canvas')
      trpia_color_one.width = "100"
      trpia_color_one.height = "50"
      trpia_color_one.style = `background-color: ${pair[0]}`

      trpia_color_two = document.createElement('canvas')
      trpia_color_two.width = "100"
      trpia_color_two.height = "50"
      trpia_color_two.style = `background-color: ${pair[1]}`

      trpia.appendChild(trpia_color_one)
      trpia.appendChild(trpia_color_two)
    })
  }
}

function showSpinner() {
  const spinner = document.getElementById('spinner')
  spinner.className = "show"
}

function hideSpinner() {
  const spinner = document.getElementById('spinner')
  spinner.className = spinner.className.replace("show", '');
}

function updateFormValues(event) {
  value = event.target.value
  inputs = document.getElementsByTagName("input")
  
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type.toLowerCase() == 'text') {
      if (inputs[i].name.toLowerCase() == event.target.name.toLowerCase()) {
        inputs[i].value = value
      }
    }
  }

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type.toLowerCase() == 'color') {
      if (inputs[i].name.toLowerCase() == event.target.name.toLowerCase()) {
        inputs[i].value = value
      }
    }
  }
}

function addColor(divName) {
  let colorForm = document.getElementById("colorForm").children[0].children[0].children
  let colors = []
  
  for (element in colorForm) {
    if(colorForm[element].id) {
      if (colorForm[element].id.includes("text")){
        colors.push(colorForm[element].value)
      }
    }
  }

  colorForm = document.getElementById(divName)

  let colorPicker = document.createElement('input')
  let hexField = document.createElement('input')
  let br = document.createElement('br')

  colorPicker.classList.add("form-control")
  colorPicker.name = `c${colors.length + 1}`
  colorPicker.type = "color"
  colorPicker.onchange = updateFormValues

  hexField.classList.add("form-control")
  hexField.type = "text"
  hexField.name = `c${colors.length + 1}`
  hexField.id = `c${colors.length + 1}_text`
  hexField.onChange = updateFormValues
  hexField.placeholder = "#ff00ff"

  colorForm.appendChild(br)
  colorForm.appendChild(colorPicker)
  colorForm.appendChild(hexField)
}

function removeColor(divName) {
  let colorForm = document.getElementById(divName)

  colorForm.removeChild(colorForm.lastElementChild)
  colorForm.removeChild(colorForm.lastElementChild)
  colorForm.removeChild(colorForm.lastElementChild)
}

function clear_input(event) {
  var form = event.target.parentElement.parentElement
  form.reset()
}