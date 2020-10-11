# apollo-cache-issue

Repro for https://github.com/apollographql/apollo-server/issues/3559

## Steps

1.  run server with existing configuration

    ```
    node index.js
    ```

1.  `cache-control` does not work:

    ```
    > curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' --data-binary '{"query":"{\n books {\n  title\n nestedObject {\n    test\n  }\n}\n}"}' --compressed -i

    HTTP/1.1 200 OK
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 100
    ETag: W/"64-M2iczi80zn4Aj/ovN/JMmAbjoYE"
    Date: Sun, 11 Oct 2020 10:06:54 GMT
    Connection: keep-alive

    {"data":{"books":{"title":"Harry Potter and the Chamber of Secrets","nestedObject":{"test":true}}}}
    ```

    `cache-control` header is not sent

2.  enable `@cacheControl(maxAge: 70)` on (`index.js:14`)
    ```
    type Object  @cacheControl(maxAge: 70) { 
      test: Boolean
    }
    ```

3.  only now is `cache-control` header sent (maxAge 70 for Object type)

    ```
    curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' --data-binary '{"query":"{\n books {\n  title\n nestedObject {\n    test\n  }\n}\n}"}' --compressed -i

    HTTP/1.1 200 OK
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    cache-control: max-age=70, public
    Content-Length: 100
    ETag: W/"64-M2iczi80zn4Aj/ovN/JMmAbjoYE"
    Date: Sun, 11 Oct 2020 10:09:38 GMT
    Connection: keep-alive

    {"data":{"books":{"title":"Harry Potter and the Chamber of Secrets","nestedObject":{"test":true}}}}
    ```

    `cache-control` header is now set
