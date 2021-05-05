const path = require('path')

const fs = require('fs')

const http = require('http')

// экспорт функций из файла
const {parseQuery, getIndexById, getNextId} = require('./functions')

// создание сервера
const server = http.createServer((req, res) => {

  // код сайта
  res.writeHead(200)

  // чтение файла с последующим переводом его в строку
  fs.readFile(path.resolve(__dirname, 'fakeRest.json'), 'utf-8', (err, data) => {

    // парсинг даты
      data = JSON.parse(data)

    // в переменную передаем парсированную ссылку
      let parse = parseQuery(req.url)

    // в случае ошибки
      if (err) {

        // вывод ошибки
        console.log(err)

        // иначе
      } else {

        // в случае если метод GET
        if (req.method === 'GET') {

          // в случае если айди не указан
          if (parse.id === null) {

            // вывод содержимого в зависимости от запроса
            res.write(JSON.stringify(data[parse.resource]))

            res.end()

            // в случае если айди указан
          } else {

            // в переменную индекс присваивается айди с помощью функции
            const index = getIndexById(data[parse.resource], parse.id)

            // вывод конкретного значения в зависимости от указанного айди
            res.write(JSON.stringify(data[parse.resource][index]))

            res.end()
          }
        }
        // в случае если метод DELETE
        if (req.method === 'DELETE') {

          // в переменную индекс присваивается айди с помощью функции
          const index = getIndexById(data[parse.resource], parse.id)

          // в случае если айди не указан
          if (parse.id === null) {

            // удаление целого объекта
            delete data[parse.resource]

            // перезаписываем файл
            fs.writeFile(path.resolve(__dirname, 'fakeRest.json'), JSON.stringify(data, null, ' '), () => {})

            res.end()

          } else {

            // удаление конкретного элемента
            data[parse.resource].splice(index, 1)

            // перезаписываем файл
            fs.writeFile(path.resolve(__dirname, 'fakeRest.json'), JSON.stringify(data, null, ' '), () => {})

            res.end()
          }
        }

        // в случае если метод POST
        if (req.method === 'POST') {

          // в переменную индекс присваивается айди с помощью функции
          const index = getNextId(data[parse.resource], parse.id)

          // обработчик событий, читающий содержимое запроса
          req.on('data', json => {

            // парсинг параметра
            json = JSON.parse(json)

            // в параметр присваивается новый индекс
            json.id = index

            // пуш нового значения в конец массива
            data[parse.resource].push(json)

            // перезаписываем файл
            fs.writeFile(path.resolve(__dirname, 'fakeRest.json'), JSON.stringify(data, null, ' '), () => {})

          })
        }

        // в случае если метод PATCH
        if (req.method === 'PATCH') {

          // в переменную индекс присваивается айди с помощью функции
          const index = getIndexById(data[parse.resource], parse.id)

          // обработчик событий, читающий содержимое запроса
          req.on('data', update => {

            // парсинг параметра
            update = JSON.parse(update)

            // объединение предыдущего и нового значения
            data[parse.resource][index] = Object.assign(data[parse.resource][index], update)

            // перезаписываем файл
            fs.writeFile(path.resolve(__dirname, 'fakeRest.json'), JSON.stringify(data, null, ' '), () => {})
          })
        }
      }
    }
  )
})
server.listen(3030)