// функция для парсинга запроса
const parseQuery = (string) => {

  // разбиение на массив
  let splits = string.split('/')

  // в переменную присваивается первое слово запроса
  let slovo = splits[1]

  // в переменную присваивается айди
  let chislo = splits[2]

  // условие для проверки наличия айди
  if (chislo <= 0 || chislo === undefined) {

    // возвращаем объект без айди
    return { resource: slovo, id: null }

    // иначе
  } else {

    // возвращаем объект с айди
    return { resource: slovo, id: Number(chislo) }
  }
}

// функция для вычисления следующего айди
const getNextId = (collection) => {

  // переменная для хранения текущего айди
  let bigValue = 0

  // цикл для обхода массива
  for (let i = 0; i < collection.length; i++) {

    // условие для проверки наибольщего айди
    if (collection[i].id > bigValue)

      // присваение в переменную айди
      bigValue = collection[i].id
  }

  // если массив пустой
  if (collection.length < 0) {

    // возвращаем единицу
    return 1
  }

  // увеличение наибольшего айди
  return bigValue + 1
}

// поиск индекса по айди
const getIndexById = (collection, id) => {

  // цикл для обхода массива
  for (let i = 0; i < collection.length; i++) {

    // сравнение введенного индекса с индексом из объекта
    if (id === collection[i].id) {
      return i
    }
  }
  // если не нашел возвращает -1
  return -1
}

module.exports = {
  parseQuery,
  getNextId,
  getIndexById
}