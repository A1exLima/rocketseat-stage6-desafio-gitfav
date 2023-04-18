import { GithubUser } from "./gitHubUser.js"

// CLASSE QUE VAI CONTER A LÓGICA DOS DADOS
export class favorites {
  constructor(root, formSearch) {
    this.root = document.querySelector(root)
    this.form = document.querySelector(formSearch)
    this.tbody = this.root.querySelector("table tbody")
    this.screenNofavorites = this.root.querySelector(".no-favorites")

    this.loadEntries()
  }
  
  loadEntries() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }

  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries) )
  }

  async add(userName){
    try{

      const userExists = this.entries.find(entry => entry.login === userName)

      if(userExists) {
        throw new Error('Usuário já cadastrado!')
      }

      const user = await GithubUser.search(userName)

      if(user.login === undefined ){
        throw new Error('Usuário não encontrado')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error){
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login != user.login
    )

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

// CLASSE QUE VAI CRIAR A VISUALIZACAO DO HTML
export class favoritesView extends favorites {
  constructor(root, formSearch) {
    super(root, formSearch)

    this.update()
    this.onadd()
  }

  onadd(){
    const addButton = this.form.querySelector(".button-favorite")

    addButton.onclick = (event) => {
      event.preventDefault()
      const {value} = this.form.querySelector("#search")
      const userName = value
      this.form.querySelector("#search").value = ""

      this.add(userName)
    }
  }
  update() {
    this.removeAllTr()
    this.creatingTrAndChangingUserData()
    this.noFavorites()
  }

  noFavorites(){
    if (this.entries.length === 0) {

      this.screenNofavorites.classList.remove("hide")

    } else {
      this.screenNofavorites.classList.add("hide")
    }
  }

  creatingTrAndChangingUserData() {
    this.entries.forEach((user) => {
      const row = this.createRow()

      row.querySelector("img").src = `https://github.com/${user.login}.png`
      row.querySelector("img").alt = `Imagem do usuário ${user.name}`
      row.querySelector("a").href = `https://github.com/${user.login}`
      row.querySelector("a p").textContent = `${user.name}`
      row.querySelector("a span").textContent = `${user.login}`
      row.querySelector(".repositories").textContent = `${user.public_repos}`
      row.querySelector(".followers").textContent = `${user.followers}`

      row.querySelector(".remove").onclick = (event) => {
        event.preventDefault()

        this.delete(user)
      }

      this.tbody.append(row)
    })
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove()
    })
  }

  createRow() {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td class="user">
              <div>
                <img
                  src="https://github.com/diego3g.png"
                  alt="Imagem do usuário"
                />
                <a href="https://github.com/diego3g" target="_blank">
                  <p>Diego Fernandes</p>
                  <span>diego3g</span>
                </a>
              </div>
            </td>
            <td class="repositories">123</td>
            <td class="followers">1234</td>
            <td>
              <button class="remove">Remover</button>
            </td>
    `
    
    return tr
  }
}
