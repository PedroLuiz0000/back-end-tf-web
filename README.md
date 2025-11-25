# back-end-tf-web
Back-End do trabalho final da disciplina de WEB

Gabrielly Thaila Moreira de Azevedo,
Kailene Rodrigues de Souza,
Lívia Santos Ventura,
Maria Eduarda da Silva,
Pedro Luiz Lopes Pereira.

## Documentação Endpoints

[GET]/imagens
Responsável por retornar/exibir as imagens de portfólio. 

[GET]/imagens/{id}
Responsável por retornar/exibir uma única imagem presente no portfólio. 

[DELETE]/imagens/{id}
Responsável por deletar/excluir uma imagem do portfólio.

[PUT]/imagens/{id}
Responsável por atualizar um única imagem presente no portfólio. 
Body:
{
    "link_imagem": "images/ImgPort1-WEB.jpeg"
}

[POST]/imagens
Responsável por cadastrar uma nova imagem ao portfólio do site. 
Body: 
{
    "link_imagem": "images/ImgPort1-WEB.jpeg"
}


[GET]/administrador
Responsável por retornar/exibir as informações necessárias do administrador do site. 

[GET]/administrador/{id}
Responsável por retomar/exibir um único administrador. 

[DELETE]/administrador/{id}
Responsável por deletar/excluir as informações do administrador. 

[PUT]/administrador/{id}
Responsável por atualizar uma informação do administrador. 
Body:
{
    "email": "admin1@email.com",
    "senha": "senha567"
}

[POST]/administrador
Responsável por cadastrar uma novo administrador. 
Body:
Body:
{
    "email": "admin1@email.com",
    "senha": "senha567"
}


[GET]/contato
Responsável por retornar/exibir as informações de contato contidas no site. 

[GET]/contato/{id}
Responsável por retomar/exibir as informações cadastradas de um contato específico.

[DELETE]/contato/{id}
Responsável por deletar/excluir as informações/formas de contato.

[PUT]/contato/{id}
Responsável por atualizar uma informação de contato presente no site.
Body:
{
    "instagram": "@admin",
    "facebook": "facebook.com/admin1",
    "whatsapp": "212345677123",
    "email": "contato@email.com"
}

[POST]/contato
Responsável por cadastrar uma nova informação de contato ao site.
Body:
{
    "instagram": "@admin",
    "facebook": "facebook.com/admin1",
    "whatsapp": "212345677123",
    "email": "contato@email.com"
}