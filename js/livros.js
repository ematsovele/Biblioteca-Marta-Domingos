const books = [
  {
    title: "O Principezinho",
    author: "Antoine de Saint-Exupéry",
    category: "Literatura"
  },
  {
    title: "A Arte de Aprender",
    author: "Josh Waitzkin",
    category: "Educação"
  },
  {
    title: "Uma Breve História do Tempo",
    author: "Stephen Hawking",
    category: "Ciência"
  },
  {
    title: "Introdução à Programação",
    author: "Autor demonstrativo",
    category: "Tecnologia"
  },
  {
    title: "A Menina do Mar",
    author: "Sophia de Mello Breyner Andresen",
    category: "Literatura"
  },
  {
    title: "Aprender a Estudar",
    author: "Autor demonstrativo",
    category: "Educação"
  }
];

// Elementos da página
const bookList = document.getElementById("bookList");
const searchBook = document.getElementById("searchBook");
const categoryFilter = document.getElementById("categoryFilter");
const sortBooks = document.getElementById("sortBooks");

const allBooksBtn = document.getElementById("allBooksBtn");
const favoriteBooksBtn = document.getElementById("favoriteBooksBtn");

const favoriteCount = document.getElementById("favoriteCount");
const favoritesHeading = document.getElementById("favoritesHeading");
const emptyMessage = document.getElementById("emptyMessage");

// Recuperar favoritos guardados no navegador
let favorites = [];

try {
  const savedFavorites = JSON.parse(
    localStorage.getItem("bmdFavorites")
  );

  if (Array.isArray(savedFavorites)) {
    favorites = savedFavorites.filter(title =>
      books.some(book => book.title === title)
    );
  }
} catch (error) {
  favorites = [];
}

// Controlar a área actualmente apresentada
let showFavorites = false;

// Guardar favoritos no navegador
function saveFavorites() {
  localStorage.setItem(
    "bmdFavorites",
    JSON.stringify(favorites)
  );
}

// Adicionar ou remover um livro dos favoritos
function toggleFavorite(title) {
  if (favorites.includes(title)) {
    favorites = favorites.filter(item => item !== title);
  } else {
    favorites.push(title);
  }

  saveFavorites();
  renderBooks();
}

// Remover directamente da lista de favoritos
function removeFavorite(title) {
  favorites = favorites.filter(item => item !== title);

  saveFavorites();
  renderBooks();
}

// Apresentar os livros
function renderBooks() {
  const search = searchBook.value.trim().toLocaleLowerCase("pt");
  const category = categoryFilter.value;
  const sortField = sortBooks.value;

  const visibleBooks = books
    .filter(book => {
      const matchesSearch =
        book.title.toLocaleLowerCase("pt").includes(search) ||
        book.author.toLocaleLowerCase("pt").includes(search);

      const matchesCategory =
        !category || book.category === category;

      const matchesFavorite =
        !showFavorites || favorites.includes(book.title);

      return matchesSearch && matchesCategory && matchesFavorite;
    })
    .sort((a, b) =>
      a[sortField].localeCompare(b[sortField], "pt")
    );

  // Limpar cartões anteriores
  bookList.replaceChildren();

  // Actualizar quantidade de favoritos
  favoriteCount.textContent = favorites.length;

  // Actualizar separadores
  allBooksBtn.classList.toggle("active", !showFavorites);
  favoriteBooksBtn.classList.toggle("active", showFavorites);

  allBooksBtn.setAttribute("aria-selected", String(!showFavorites));
  favoriteBooksBtn.setAttribute("aria-selected", String(showFavorites));

  // Mostrar ou esconder o título da área de favoritos
  favoritesHeading.hidden = !showFavorites;

  // Mensagem quando não existem resultados
  emptyMessage.hidden = visibleBooks.length !== 0;

  if (visibleBooks.length === 0) {
    if (showFavorites && favorites.length === 0) {
      emptyMessage.textContent =
        "Ainda não adicionou nenhum livro aos seus favoritos.";
    } else if (showFavorites) {
      emptyMessage.textContent =
        "Não foram encontrados favoritos com estes critérios.";
    } else {
      emptyMessage.textContent =
        "Não foram encontrados livros com estes critérios.";
    }
  }

  // Criar os cartões dos livros
  visibleBooks.forEach(book => {
    const isFavorite = favorites.includes(book.title);

    const card = document.createElement("article");
    card.className = "book-card";

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = `Autor: ${book.author}`;

    const categoryLabel = document.createElement("span");
    categoryLabel.className = "book-category";
    categoryLabel.textContent = book.category;

    // Botão de adicionar ou remover favorito
    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.className = "favorite-btn";

    if (isFavorite) {
      favoriteButton.classList.add("selected");
      favoriteButton.textContent = "Remover dos favoritos";
    } else {
      favoriteButton.textContent = "Adicionar aos favoritos";
    }

    favoriteButton.addEventListener("click", () => {
      toggleFavorite(book.title);
    });

    card.append(
      title,
      author,
      categoryLabel,
      favoriteButton
    );

    // Botão adicional de apagar na área de favoritos
    if (showFavorites && isFavorite) {
      const deleteButton = document.createElement("button");

      deleteButton.type = "button";
      deleteButton.className = "delete-favorite-btn";
      deleteButton.textContent = "Apagar dos favoritos";

      deleteButton.setAttribute(
        "aria-label",
        `Apagar ${book.title} dos favoritos`
      );

      deleteButton.addEventListener("click", () => {
        removeFavorite(book.title);
      });

      card.appendChild(deleteButton);
    }

    bookList.appendChild(card);
  });
}

// Mostrar todos os livros
allBooksBtn.addEventListener("click", () => {
  showFavorites = false;
  renderBooks();
});

// Mostrar apenas favoritos
favoriteBooksBtn.addEventListener("click", () => {
  showFavorites = true;
  renderBooks();
});

// Pesquisa em tempo real
searchBook.addEventListener("input", renderBooks);

// Filtrar por categoria
categoryFilter.addEventListener("change", renderBooks);

// Ordenar livros
sortBooks.addEventListener("change", renderBooks);

// Apresentar catálogo ao abrir a página
renderBooks();