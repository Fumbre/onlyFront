(()=>{
  const LOCAL = 'http://localhost:3000'

  async function getUpdateClients() {
    const container = document.getElementById('client-main')
    container.classList.add('load')
    const data = await fetch(`${LOCAL}/api/clients`)
      .then((request)=>{
        container.classList.remove('load')
        return request.json()
      })
      .catch(error =>{
        container.classList.remove('load')
        container.classList.add('load-failed')
      })
    if(data) {
      createDomClients(data)
      makeSortClients(data)
    }
  }

  function toAddCleint(objectClient){
    const container = document.getElementById('client-main')
    container.classList.add('load')
    fetch(`${LOCAL}/api/clients`, {
      method: 'POST',
      headers: {
          'Content-type': 'application/json'
      },
      body: JSON.stringify({
          name: objectClient.name,
          surname: objectClient.surname,
          lastName: objectClient.lastName,
          contacts: objectClient.contacts,
      })
    })
      .then((request)=>{
        getUpdateClients()
        return request.json()
      })
      .catch(error=>{
        serverFailed(document.querySelector('.overlay__contact-wrapper'))
      })
  }

  function toChangeClient(objectClient, id) {
    const container = document.getElementById('client-main')
    container.classList.add('load')
    fetch(`${LOCAL}/api/clients/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: objectClient.name,
          surname: objectClient.surname,
          lastName: objectClient.lastName,
          contacts: objectClient.contacts,
      })
    })
      .then(req => {
        getUpdateClients()
        return req.json()
      })
      .catch(er => serverFailed(document.querySelector('.overlay__contact-wrapper')))
  }

  function toDeleteClient(id) {
    const container = document.getElementById('client-main')
    container.classList.add('load')
    fetch(`${LOCAL}/api/clients/${id}`, {
      method: 'DELETE',
    })
      .then(req=>{
        getUpdateClients()
        return req.json()
      })
      .catch(err => serverFailed(document.querySelector('.overlay__contact-wrapper')))
  }

  async function toFindClient(word){
    const req = await fetch(`${LOCAL}/api/clients?search=${word}`)
    const data = await req.json()
    return data
  }

  getUpdateClients()

  function createDomClients(arrayObjectsClients) {
    const container = document.getElementById('client-main')

    while(container.firstChild) {
      container.removeChild(container.firstChild)
    }

    const elements = arrayObjectsClients.map(item => {
      const el = document.createElement('li')
      el.classList.add('client-main__item')
      el.append(createElementClinet(item))
      return el
    })
    elements.forEach(item => container.append(item))
  }

  function createElementClinet(objectClient) {
    const ulElement = createElementList('ul', ['client__list'])


    const id = createId(objectClient.id)
    const lfm = createLfm(objectClient.lastName, objectClient.name, objectClient.surname)
    const dateTime = createDateTime(objectClient.createdAt)
    const change = createDateTime(objectClient.updatedAt)
    const contacts = createContacts(objectClient.contacts)
    const tools = createTools(['Изменить', 'Удалить'], objectClient.id)


    function createLfm(lastname, firstname, middlename) {
      const liElement = createElementList('li', ['client__item', 'client__lfm'], `${lastname} ${firstname} ${middlename}`)
      ulElement.append(liElement)
      return `${lastname} ${firstname} ${middlename}`
    }

    function createId(id) {
      const liElement = createElementList('li', ['client__item', 'client__id'], `${id}`)
      ulElement.append(liElement)
      return `${id}`
    }

    function createDateTime(date) {
      const customDate = `${new Date(date).getMonth() + 1 < 10 ? '0' + new Date(date).getMonth() : new Date(date).getMonth() }.${new Date(date).getDate() < 10 ? '0' +  new Date(date).getDate() : new Date(date).getDate()}.${new Date(date).getFullYear()}`
      const customTime = `${new Date(date).getHours() < 10 ? '0' + new Date(date).getHours() : new Date(date).getHours()}:${new Date(date).getMinutes() < 10 ? '0' + new Date(date).getMinutes() : new Date(date).getMinutes()}`
      const liElement = createElementList('li', ['client__item', 'client__date'])
      createElementList('span', ['client__customTime'], `${customTime}`, liElement)
      createElementList('span', ['client__customDate'], `${customDate}`, liElement)

      ulElement.append(liElement)
      return date
    }

    function createContacts(array) {
      const liElement = createElementList('li', ['client__item', 'client__contacts'])
      const elementUl = createElementList('ul', ['client-contacts__list'])
      const arrayLength = array.length

      for(let i = 0; i < arrayLength; i++){
        if (arrayLength > 5) {
          if(i === 4) {
            const showMoreContacts = createElementList('li', ['client-contacts__item', 'client-contacts__item-showmore'], null)
            showMoreContacts.setAttribute('tabindex', '0')
            elementUl.classList.add('client__item--active')
            elementUl.append(showMoreContacts)
            showMoreContacts.addEventListener('click', ()=> {
              showMoreContacts.classList.remove('client-contacts__item-showmore')
              elementUl.classList.remove('client__item--active')
              elementUl.childNodes.forEach(item => item.classList.remove('client-contacts__item--hidden'))
              showMoreContacts.classList.add('client-contacts__item--hidden')
            })
          }
          if(i > 3) elementUl.querySelector('.client-contacts__item-showmore').textContent = `+${i - 3}`
        }
        const nameContact = array[i].type
        const textConctact = array[i].value
        const elementli = createElementList('li', ['client-contacts__item'])
        if(arrayLength > 5) {
          if(i > 3)elementli.classList.add('client-contacts__item--hidden')
        }
        const span = createElementList('span', ['client-contacts__span'], textConctact)
        createElementList('strong', ['client-contacts__strong'], `${nameContact}: `, span)
        
        elementli.append(span)
        addClassForIcon(elementli)
        
        function addClassForIcon(element) {
          if (nameContact == 'vk') element.classList.add('icon-vk')
          if (nameContact == 'телефон') element.classList.add('icon-phone')
          if (nameContact == 'email') element.classList.add('icon-email')
          if (nameContact == 'facebook') element.classList.add('icon-facebook')
        }
        const button = createElementList('button', ['client-contacts__button'], null, elementli)
        button.addEventListener('click', ()=> {
          elementli.classList.toggle('client-contacts__item--visible')
          span.classList.toggle('client-contacts__span--visible')
        })
        elementUl.append(elementli)
      }


      liElement.append(elementUl)
      ulElement.append(liElement)
    }

    function createTools(names = [], id) {
      const liElement = createElementList('li', ['client__item', 'client__tools', 'client-tools'])

      for(let i = 0; i <= names.length - 1; i++) {
        const elementBtn = createElementList('button', ['client-tools__tool', `client-tools__tool${i}`], names[i])
        elementBtn.addEventListener('click', ()=>{
          if( i === 0) changeClientApp(id)
          if( i === 1) delteClientApp(id)
        })
        liElement.append(elementBtn)
      }
      ulElement.append(liElement)
    }

    function createElementList(element, classes = [], textContent = null, parentElement = false) {
      const el = document.createElement(element)
      classes.forEach(classItem => el.classList.add(classItem))
      el.textContent = textContent
      if (parentElement) parentElement.prepend(el)
      return el
    }

    return ulElement
  }

  function delteClientApp(id){
    const container = document.getElementById('body')
    const divOverlay = createOverlay('div', ['overlay'], null, container, () => removeElementAndChildren(divOverlay))
    const div = createOverlay('div', ['overlay__wrapper', 'overlay__delete-wrapper'], null, divOverlay, false)
    createOverlay('h2', ['overlay__title'], 'Удалить клиента', div, false)
    createOverlay('p', ['overlay__text'], 'Вы действительно хотите удалить данного клиента?', div, false)
    createOverlay('button', ['overlay__delete-btn', 'overlay-btn'], 'Удалить', div, () => {toDeleteClient(id), removeElementAndChildren(divOverlay)})
    createOverlay('button', ['overlay__cancle-btn', 'overlay-btn'], 'Отмена', div, () => removeElementAndChildren(divOverlay))
    createOverlay('button', ['overlay__close-btn', 'overlay-btn'], null, div, () => removeElementAndChildren(divOverlay))
  }

  function addClientApp() {
    const container = document.getElementById('body')
    const divOverlay = createOverlay('div', ['overlay'], null, container, () => removeElementAndChildren(divOverlay))
    const div = createOverlay('div', ['overlay__wrapper', 'overlay-addClient'], null, divOverlay, false)
    createOverlay('h2', ['overlay-addClient__title'], 'Новый клиент', div, false)
    const form = createOverlay('form', ['overlay__form'], null, div, false)
    const formData = createFormsElement(form)
    createOverlay('button', ['overlay__cancle-btn', 'overlay-btn'], 'Отмена', div, () => removeElementAndChildren(divOverlay))
    createOverlay('button', ['overlay__close-btn', 'overlay-btn'], null, div, () => removeElementAndChildren(divOverlay))
    form.addEventListener('submit', (event)=>{
      event.preventDefault()
      checkValidToSend(form, formData, 'add')
    })
  }

  async function changeClientApp(id) {
    const container = document.getElementById('body')
    const divOverlay = createOverlay('div', ['overlay'], null, container, () => removeElementAndChildren(divOverlay))
    const div = createOverlay('div', ['overlay__wrapper', 'overlay-changeClient'], null, divOverlay, false)
    div.classList.add('overlay-changeClient__load')
    const clientReq = await fetch(`${LOCAL}/api/clients/${id}`)
    const clientObj = await clientReq.json()
    if(clientObj) div.classList.remove('overlay-changeClient__load')
    createOverlay('h2', ['overlay-changeClient__title'], 'Изменить клиента', div, false)
    createOverlay('span', ['overlay-changeClient__title-id'], `ID: ${id}`, div, false)
    const form = createOverlay('form', ['overlay__form'], null, div, false)
    const formData = createFormsElement(form, clientObj)
    createOverlay('button', ['overlay__cancle-btn', 'overlay-btn'], 'Удалить', div, () => {removeElementAndChildren(divOverlay), delteClientApp(id)})
    createOverlay('button', ['overlay__close-btn', 'overlay-btn'], null, div, () => removeElementAndChildren(divOverlay))
    form.addEventListener('submit', (event)=>{
      event.preventDefault()
      checkValidToSend(form, formData, 'change', id)
    })
  }

  function createFormsElement(form, object = false) {
    const contactsData = []

    const labelLastName = createOverlay('label', ['overlay__label', 'overlay-label', 'label-lastname'], null, form, false)
    createOverlay('span', ['overlay-label__span', 'overlay-label__span-lastname'], 'Фамилия', labelLastName)
    const inputLastName = createInput('input', ['overlay__input', 'input-lastname'], false, object.lastName, 'text', labelLastName, (value) => validInputString(value))
    const labelName = createOverlay('label', ['overlay__label', 'overlay-label', 'label-name'], null, form, false)
    createOverlay('span', ['overlay-label__span', 'overlay-label__span-name'], 'Имя', labelName)
    const inputName = createInput('input', ['overlay__input', 'input-name'], false, object.name, 'text', labelName, (value) => validInputString(value))
    const labelMiddleName = createOverlay('label', ['overlay__label', 'overlay-label', 'label-middlename'], null, form, false)
    createOverlay('span', ['overlay-label__span', 'overlay-label__span-middlename'], 'Отчество', labelMiddleName)
    const inputMid = createInput('input', ['overlay__input', 'input-middlename'], false, object.surname, 'text', labelMiddleName, (value) => validInputString(value))
    const contactWrapper = createOverlay('div', ['overlay__contact-wrapper'], null, form, false )
    const contacts = createOverlay('div', ['overlay__contacts', 'overlay-contacts'], null, contactWrapper)
    const buttonAddContact = createOverlay('button', ['overlay__add-contact', 'btn-contact'], null, contactWrapper)
    buttonAddContact.type = 'button'
    createOverlay('span', ['btn-contact__text'], 'Добавить контакт', buttonAddContact)
    createInput('input', ['overlay__save-btn', 'overlay-btn'], false, 'Сохранить', 'submit', form, false)

    giveEventLisToElement(inputLastName)
    giveEventLisToElement(inputName)
    giveEventLisToElement(inputMid)

    const contactsExistence = object.contacts
    let contactsExistenceLength = 0
    if (contactsExistence){
      contactsExistenceLength = contactsExistence.length
      if(contactsExistenceLength >= 10 ) buttonAddContact.classList.add('overlay__add-contact--hidden')
      contactsExistence.forEach(item => {
        createContactStructure(contacts, item)
      })
    }
    buttonAddContact.addEventListener('click', ()=>{
      
      if (contactsExistenceLength >= 10) {
        console.log('error')
      }else {
        createContactStructure(contacts, false, ++contactsExistenceLength)
        if(contactsExistenceLength > 9) buttonAddContact.classList.add('overlay__add-contact--hidden')
      }
    })


    function createContactStructure(parent, object = false){
      const container = createOverlay('div', ['overlay-contacts__wrapper'], null, parent)
      const ul = createOverlay('ul', ['overlay-contacts__list'], null, container)
      const optionPorp = [{type: 'телефон', value: 'Телефон', inputType: 'tel'}, {type: 'email', value: 'Email', inputType: 'email'}, {type: 'vk', value: 'Vk', inputType: 'text'}, {type: 'facebook', value: 'Facebook', inputType: 'text'}, {type: 'контакт', value: 'Другое', inputType: 'text'}]
      const inputOptions = []
      const input = createInput('input', ['overlay-contacts__input'], false, object.value, 'text', container, (value) => validInput(value))
      const btn = createOverlay('button', ['overlay-contacts__btn-clean', 'overlay-btn'], '', container, () => {removeElementAndChildren(container); deleteContactData()})
      btn.setAttribute('type', 'button')
      createOverlay('span', ['overlay-btn__tool-tip', 'tool-tip'], 'Удалить контакт', btn, () => {removeElementAndChildren(container); deleteContactData()})

      optionPorp.forEach((item, index) =>{
        createLiElement(item, index === 0, object.type)
        inputOptions.push(item.type)
      })

      function createLiElement(propertys, active = false, selected = false) {
        const li = document.createElement('li')
        ul.append(li)
        li.textContent = propertys.value
        li.classList.add('overlay-contacts__item')
        if(active && !selected) {
          li.classList.add('overlay-contacts__item--selected') 
          input.setAttribute('type', propertys.inputType)
        }

        if(selected === propertys.type) {
          li.classList.add('overlay-contacts__item--selected') 
          input.setAttribute('type', propertys.inputType)
        }
        li.addEventListener('click', ()=>{
          li.parentElement.childNodes.forEach(item => item.classList.remove('overlay-contacts__item--selected'))
          li.classList.add('overlay-contacts__item--selected')
          input.setAttribute('type', propertys.inputType)
        })
      }

      function deleteContactData(){
        contactsData.splice(0, 1)
        --contactsExistenceLength
        buttonAddContact.classList.remove('overlay__add-contact--hidden')
      }

      ul.addEventListener('click', (ev)=>{
        const container = ul.parentElement.parentElement.parentElement.parentElement.parentElement
        container.addEventListener('click', removeBehavior)
        
        function removeBehavior(even){
          if(ev.target != even.target) ul.classList.remove('overlay-contacts__list--active')
          if(!ul.classList.contains('overlay-contacts__list--active')) container.removeEventListener('click', removeBehavior)
        }

        ul.classList.toggle('overlay-contacts__list--active')
      })

      contactsData.push(inputOptions)
    }

    function giveEventLisToElement(element) {
      if(element.value.trim() != '') element.parentElement.querySelector('.overlay-label__span').classList.add('overlay-label__span--active')

      element.addEventListener('focus', ()=> {
        element.parentElement.querySelector('.overlay-label__span').classList.add('overlay-label__span--active')
      })

      element.addEventListener('blur', ()=> {
        spanAnimation(element)
      })
    }
 
    function spanAnimation(element) {
      if(element.value != '') {
        element.parentElement.querySelector('.overlay-label__span').classList.add('overlay-label__span--active')
      }else element.parentElement.querySelector('.overlay-label__span').classList.remove('overlay-label__span--active')
    }

    return contactsData
  }

  document.querySelector('.client__add-btn').addEventListener('click', () => addClientApp())

  function checkValidToSend(el, elData, method, id){
    const name = el.querySelector('.input-name')
    const lastname = el.querySelector('.input-lastname')
    const surname = el.querySelector('.input-middlename')
    const contacts = el.querySelectorAll('.overlay-contacts__input')
    let contactCheck = true
    contacts.forEach(item=>{
      if(!validInput(item)) {
        contactCheck = false
        item.parentElement.classList.add('notValid')
      }
    })
    const nameCheck = validInputString(name)
    const lastnameCheck = validInputString(lastname)
    const surnameCheck = validInputString(surname)
    if( nameCheck && lastnameCheck && surnameCheck && contactCheck) {
      const objectForm = createObjectForm(el, elData)
      if(objectForm) {
        if(method === 'add') {
          toAddCleint(objectForm)
          removeElementAndChildren(document.querySelector('.overlay'))
        }
        if(method === 'change') {
          toChangeClient(objectForm, id)
          removeElementAndChildren(document.querySelector('.overlay'))
        }
        
      } else console.log('error')

    } else {
      animateElement(el.querySelector('.overlay__save-btn'), 'block')
      if(!nameCheck) name.parentElement.classList.add('notValid')
      if(!lastnameCheck) lastname.parentElement.classList.add('notValid')
      if(!surnameCheck) surname.parentElement.classList.add('notValid')

    }
  }

  function createObjectForm(form, contactsTypes){
    const name = form.querySelector('.input-name').value.trim()
    const lastname = form.querySelector('.input-lastname').value.trim()
    const surname = form.querySelector('.input-middlename').value.trim()
    const contactsValue = []
    let validFaild = false
    if(contactsTypes.length === 0) return {name: upperCaseFirstLetter(name), lastName: upperCaseFirstLetter(lastname), surname: upperCaseFirstLetter(surname), contacts: contactsValue}

    const contact = form.querySelectorAll('.overlay-contacts__input')
    contact.forEach((item, index)=>{
      const contactSelectedType = item.parentElement.querySelector('.overlay-contacts__item--selected')
      const contactIndex = () => {if(contactSelectedType) return [...contactSelectedType.parentElement.childNodes].indexOf(contactSelectedType)}
      const contactValue = item.value.trim()

      if(contactIndex() === undefined || contactsTypes[index][contactIndex()] === undefined) validFaild = true

      const contacts = {
        type: contactsTypes[index][contactIndex()],
        value: contactValue
      }
      contactsValue.push(contacts)
    })

    function upperCaseFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    }

    if (validFaild) return false

    return {name: upperCaseFirstLetter(name), lastName: upperCaseFirstLetter(lastname), surname: upperCaseFirstLetter(surname), contacts: contactsValue}
  }

  function animateElement(element, className,) {
    let startTime = null;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp
        const elapsedTime = timestamp - startTime

        if (elapsedTime < 300) {
            element.classList.add(className)
        } else element.classList.remove(className)
        if (elapsedTime < 1000) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate);
  }

  function serverFailed(afterEl) {
    const errorEl = document.createElement('div');
    errorEl.classList.add('overlay__server-fail')
    errorEl.textContent = 'Ошибка: новая модель организационной деятельности предполагает независимые способы реализации поставленных обществом задач!';
    afterEl.insertAdjacentElement('afterend', errorEl)
  }

  function createOverlay(el, classes = [], textContent = null, parentElement = false, fun = false) {
    const element = document.createElement(el)
    classes.forEach(item => {
      element.classList.add(item)
    })
    element.textContent = textContent
    if(parentElement) parentElement.append(element)
    if(fun) element.addEventListener('click', (event)=> {
      if(event.target === element) fun()
    })
    return element
  }

  function createInput(el, classes = [], placeholder = false, content = false, type, parentElement = false, fun = false) {
    const element = document.createElement(el)
    classes.forEach(item => {
      element.classList.add(item)
    })
    element.setAttribute('type', type)
    if(content) element.setAttribute('value', content)
    if(placeholder) element.setAttribute('placeholder', placeholder)
    if(parentElement) parentElement.append(element)
    if(fun) element.addEventListener('change', ()=> {
      if(!fun(element)) {
        element.parentElement.classList.add('notValid')
      }else element.parentElement.classList.remove('notValid')
    })
    return element
  }

  function removeElementAndChildren(parent){
    while(parent.firstChild) {
      parent.removeChild(parent.firstChild)
    }
    parent.remove()
  }

  function validInput(input){
    const value = input.value.trim()
    if (value.length > 1) {
      let valid = true
      for(let word of value) {
        if(word === ' ') valid = false
      }
      return valid
    } else return false
  }

  function validInputString(input){
    const value = input.value.trim()
    if (value.length > 1) {
      let valid = true
      for(let word of value.toLowerCase()) {
        if(word.toLowerCase() === word.toUpperCase()) valid = false 
        if(word === ' ') valid = false
      }
      return valid
    } else return false
  }


  function makeSortClients(arrayObjCleints) {
    const clientHeader = document.querySelector('.client-header')
    let prevEl = []
    let count = 0
    const clientId = clientHeader.querySelector('.client-header__id')
    const clientLfm = clientHeader.querySelector('.client-header__lfm')
    const dateTime = clientHeader.querySelector('.client-header__date')
    const change = clientHeader.querySelector('.client-header__changes')
    toggleClass(clientId, null)

    evntLisSort(clientId, arrayObjCleints, 'id')
    evntLisSort(clientLfm, arrayObjCleints, 'lastName')
    evntLisSort(dateTime, arrayObjCleints, 'createdAt')
    evntLisSort(change, arrayObjCleints, 'updatedAt')

    function counting(targeto) {
      if(prevEl.length === 0) prevEl.push(targeto)
      prevEl.push(targeto)
      if(prevEl[0] === prevEl[1]){
        count++
      } else count = 1
      if(prevEl.length > 1) prevEl.splice(0, 1)
      if(count > 2) count = 1

      return count
    }

    function evntLisSort(element, objName, objKey) {
      element.addEventListener('click', (e)=> {
        let position = counting(e.target)
        sort(objName, objKey, position)
        toggleClass(e.target, position)
      })
    }

    function sort(object, key, direction) {
      direction > 0 ? direction === 1 ? direction = false : direction = true : direction = null
      const array = [...object]
      if(direction === null) {
        createDomClients(object)
      }else {
        const sortedArray = array.sort((a, b)=> !direction ? b[key] > a[key] ? 1 : -1 : b[key] < a[key] ? 1 : -1)
        createDomClients(sortedArray)
      }
    }

    function toggleClass(element, state) {
      state > 0 ? state === 1 ? state = true : state = false : state = null
      const childrens = [...clientHeader.children]
      childrens.forEach(item => {
        item.classList.remove('client-header__active')
        item.classList.remove('arrow')
        item.classList.remove('arrow-down')
      })
      if(state != null) {
        element.classList.add('client-header__active')
      }else childrens[0].classList.add('client-header__active')
      if(state === true) element.classList.add('arrow')
      if(state === false) element.classList.add('arrow-down')
    }

  }

  function findClient(){
    const input = document.querySelector('.header__input')

    input.addEventListener('input', ()=>{
      const timer = setTimeout(async ()=>{
        const data = await toFindClient(input.value.trim())
        createDomClients(data)
        makeSortClients(data)
      }, 300)

      clearTimeout(timer - 1)
    })
  } findClient()


})();