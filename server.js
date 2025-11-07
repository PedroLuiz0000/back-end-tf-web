import express from "express"; // Requisição do pacote do express
import pkg from "pg"; // Requisição do pacote do pg (PostgreSQL)
import dotenv from "dotenv"; // Importa o pacote dotenv para carregar variáveis de ambiente


const app = express(); // Inicializa o servidor Express
//server.js - configuração do servidor
app.use(express.json()); // Middleware para interpretar requisições com corpo em JSON
const port = 3000; // Define a porta onde o servidor irá escutar
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env
const { Pool } = pkg; // Obtém o construtor Pool do pacote pg para gerenciar conexões com o banco de dados PostgreSQL

let pool = null;

//server.js
// Função para obter uma conexão com o banco de dados
function conectarBD() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.URL_BD,
    });
  }
  return pool;
}

app.get("/", async (req, res) => {
  //server.js
  const db = conectarBD(); // Cria uma nova instância do Pool para gerenciar conexões com o banco de dados
  console.log("Rota GET / solicitada"); // Log no terminal para indicar que a rota foi acessada

  let dbStatus = "ok";

  // Tenta executar uma consulta simples para verificar a conexão com o banco de dados
  // Se a consulta falhar, captura o erro e define o status do banco de dados como a mensagem de erro
  try {
    await db.query("SELECT 1");
  } catch (e) {
    dbStatus = e.message;
  }

// Responde com um JSON contendo uma mensagem, o nome do autor e o status da conexão com o banco de dados
  res.json({
    message: "API para o trabalho final",
    author: "Gabrielly Thaila Moreira de Azevedo, Kailene Rodrigues de Souza,Lívia Santos Ventura,Maria Eduarda da Silva, Pedro Luiz Lopes Pereira",
    dbStatus: dbStatus,
  });
});

app.get("/imagens", async (req, res) => {
  //server.js
  const db = conectarBD();
  console.log("Rota GET /imagens solicitada"); // Log no terminal para indicar que a rota foi acessada
""
  try {
    const resultado = await db.query("SELECT * FROM imagens"); // Executa uma consulta SQL para selecionar todas as questões
    const dados = resultado.rows; // Obtém as linhas retornadas pela consulta
    res.json(dados); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error(e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor",
      mensagem: "Não foi possível buscar as imagens",
    });
  }
});

app.listen(port, () => {
  // Inicia o servidor na porta definida
  // Um socket para "escutar" as requisições
  console.log(`Serviço rodando na porta:  ${port}`);
});


app.get("/imagens/:id", async (req, res) => {
  console.log("Rota GET /imagens/:id solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    const consulta = "SELECT * FROM imagens WHERE id = $1"; // Consulta SQL para selecionar a questão pelo ID
    const resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    const dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se a questão foi encontrada
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Imagem não encontrada" }); // Retorna erro 404 se a questão não for encontrada
    }

    res.json(dados); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao buscar questão:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.delete("/imagens/:id", async (req, res) => {
  console.log("Rota DELETE /imagens/:id solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    let consulta = "SELECT * FROM imagens WHERE id = $1"; // Consulta SQL para selecionar a questão pelo ID
    let resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    let dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se a imagem foi encontrada
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Imagem não encontrada" }); // Retorna erro 404 se a imagem não for encontrada
    }

    consulta = "DELETE FROM imagens WHERE id = $1"; // Consulta SQL para deletar a imagem pelo ID
    resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    res.status(200).json({ mensagem: "Imagem excluida com sucesso!!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao excluir imagem:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.post("/imagens", async (req, res) => {
  console.log("Rota POST /imagens solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const data = req.body; // Obtém os dados do corpo da requisição
    // Validação dos dados recebidos
    if (!data.link_img) {
      return res.status(400).json({
        erro: "Dados inválidos",
        mensagem:
          "O campo contendo o link da imagem é obrigatório",
      });
    }

    const db = conectarBD(); // Conecta ao banco de dados

    const consulta =
      "INSERT INTO imagens(link_imagem) VALUES ($1) "; // Consulta SQL para inserir a questão
    const imagem= [data.link_img]; // Array com os valores a serem inseridos
    const resultado = await db.query(consulta, imagem); // Executa a consulta SQL com os valores fornecidos
    res.status(201).json({ mensagem: "Imagem criada com sucesso!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao inserir imagem:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.put("/imagens/:id", async (req, res) => {
  console.log("Rota PUT /imagens solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    let consulta = "SELECT * FROM imagens WHERE id = $1"; // Consulta SQL para selecionar a questão pelo ID
    let resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    let imagem = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se a imagem foi encontrada
    if (imagem.length === 0) {
      return res.status(404).json({ message: "Imagem não encontrada" }); // Retorna erro 404 se a questão não for encontrada
    }

    const data = req.body; // Obtém os dados do corpo da requisição

    // Usa o valor enviado ou mantém o valor atual do banco
    data.link_imagem = data.link_imagem || imagem[0].link_imagem;

    // Atualiza a questão
    consulta = "UPDATE imagem SET link_img = $1 WHERE id = $2";
    // Executa a consulta SQL com os valores fornecidos
    resultado = await db.query(consulta, [
      data.link_imagem,
      id,
    ]);

    res.status(200).json({ message: "Imagem atualizada com sucesso!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao atualizar imagem:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
});

app.get("/administrador", async (req, res) => {
  //server.js
  const db = conectarBD(); 
  console.log("Rota GET /administrador solicitada"); 
 
  try {
    const resultado = await db.query("SELECT * FROM administrador"); 
    const dados = resultado.rows; 
    res.json(dados); 
  } catch (e) {
    console.error("Erro ao buscar dados do administrador:", e); 
    res.status(500).json({
      erro: "Erro interno do servidor",
      mensagem: "Não foi possível buscar os dados do administrador",
    });
  }
});

app.get("/administrador/:id_admin", async (req, res) => {
  console.log("Rota GET /administrador/:id_admin solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id_admin = req.params.id_admin; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    const consulta = "SELECT * FROM administrador WHERE id = $1"; // Consulta SQL para selecionar a questão pelo ID
    const resultado = await db.query(consulta, [id_admin]); // Executa a consulta SQL com o ID fornecido
    const dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se o admin foi encontrado
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Dados não encontrados" }); // Retorna erro 404 se a questão não for encontrada
    }

    res.json(dados); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error(e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.delete("/administrador/:id_admin", async (req, res) => {
  console.log("Rota DELETE /administrador/:id_admin solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id_admin = req.params.id_admin; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    let consulta = "SELECT * FROM administrador WHERE id_admin = $1"; // Consulta SQL para selecionar a questão pelo ID
    let resultado = await db.query(consulta, [id_admin]); // Executa a consulta SQL com o ID fornecido
    let dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se o admin foi encontrado
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Administrador não encontrado" }); // Retorna erro 404 se a imagem não for encontrada
    }

    consulta = "DELETE FROM administrador WHERE id_admin = $1"; // Consulta SQL para deletar a imagem pelo ID
    resultado = await db.query(consulta, [id_admin]); // Executa a consulta SQL com o ID fornecido
    res.status(200).json({ mensagem: "Administrador excluido com sucesso!!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao excluir o administrador", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.post("/administrador", async (req, res) => {
  console.log("Rota POST /administrador solicitado"); // Log no terminal para indicar que a rota foi acessada

  try {
    const data = req.body; // Obtém os dados do corpo da requisição
    // Validação dos dados recebidos
    if (!data.email || !data.senha) {
      return res.status(400).json({
        erro: "Dados inválidos",
        mensagem:
          "Os campus contendo o email e a senha são obrigatórios",
      });
    }

    const db = conectarBD(); // Conecta ao banco de dados

    const consulta =
      "INSERT INTO administrador(email, senha ) VALUES ($2) "; // Consulta SQL para inserir a questão
    const administradores  = [data.email, data.senha]; // Array com os valores a serem inseridos
    const resultado = await db.query(consulta, administradores); // Executa a consulta SQL com os valores fornecidos
    res.status(201).json({ mensagem: "Administrador criado com sucesso!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao inserir administrador:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.put("/administrador/:id_admin", async (req, res) => {
  console.log("Rota PUT /administrador solicitado"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id_admin = req.params.id_admin; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    let consulta = "SELECT * FROM administrador WHERE id_admin = $1"; // Consulta SQL para selecionar a questão pelo ID
    let resultado = await db.query(consulta, [id_admin]); // Executa a consulta SQL com o ID fornecido
    let administradores = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se a imagem foi encontrada
    if (administradores.length === 0) {
      return res.status(404).json({ message: "Administrador não encontrado" }); // Retorna erro 404 se a questão não for encontrada
    }

    const data = req.body; // Obtém os dados do corpo da requisição

    // Usa o valor enviado ou mantém o valor atual do banco
    data.email = data.email|| administradores[0].email;
    data.senha = data.senha|| administradores[0].senha;
    // Atualiza a questão
    consulta = "UPDATE administrador SET email = $1, senha = $2 WHERE id_admin= $3";
    // Executa a consulta SQL com os valores fornecidos
    resultado = await db.query(consulta, [
      data.email,
      data.senha,
      id_admin,
    ]);

    res.status(200).json({ message: "Administrador atualizado com sucesso!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao atualizar o administrador:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
});

app.get("/contato", async (req, res) => {
  //server.js
  const db = conectarBD(); 
  console.log("Rota GET /contato solicitado"); 
 
  try {
    const resultado = await db.query("SELECT * FROM contato"); 
    const dados = resultado.rows; 
    res.json(dados); 
  } catch (e) {
    console.error("Erro ao buscar dados do contato:", e); 
    res.status(500).json({
      erro: "Erro interno do servidor",
      mensagem: "Não foi possível buscar os dados do contato",
    });
  }
});

app.get("/contato/:id_contato", async (req, res) => {
  console.log("Rota GET /contato/:id_contato solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id_contato = req.params.id_contato; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    const consulta = "SELECT * FROM contato WHERE id_contato = $1"; // Consulta SQL para selecionar a questão pelo ID
    const resultado = await db.query(consulta, [id_contato]); // Executa a consulta SQL com o ID fornecido
    const dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se a questão foi encontrada
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Dados não encontrados" }); // Retorna erro 404 se a questão não for encontrada
    }

    res.json(dados); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error(e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.delete("/contato/:id_contato", async (req, res) => {
  console.log("Rota DELETE /contato/:id_contato solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id_contato = req.params.id_contato; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    let consulta = "SELECT * FROM contato WHERE id_contato = $1"; // Consulta SQL para selecionar a questão pelo ID
    let resultado = await db.query(consulta, [id_contato]); // Executa a consulta SQL com o ID fornecido
    let dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se o contato foi encontrado
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Contato não encontrado" }); // Retorna erro 404 se a imagem não for encontrada
    }

    consulta = "DELETE FROM contato WHERE id_contato = $1"; // Consulta SQL para deletar a imagem pelo ID
    resultado = await db.query(consulta, [id_contato]); // Executa a consulta SQL com o ID fornecido
    res.status(200).json({ mensagem: "Contato excluido com sucesso!!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao excluir o contato", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.post("/contato", async (req, res) => {
  console.log("Rota POST /contato solicitado"); // Log no terminal para indicar que a rota foi acessada

  try {
    const data = req.body; // Obtém os dados do corpo da requisição
    // Validação dos dados recebidos
    if (!data.instagram || !data.facebook || !data.whatsapp || !data.email ) {
      return res.status(400).json({
        erro: "Dados inválidos",
        mensagem:
          "Os campus contendo instagram, facebook, whatsapp e email são obrigatórios",
      });
    }

    const db = conectarBD(); // Conecta ao banco de dados

    const consulta =
      "INSERT INTO contato(instagram, facebook, whatsapp, email) VALUES ($4) "; // Consulta SQL para inserir a questão
    const contatos = [data.instagram, data.facebook, data.whatsapp, data.email]; // Array com os valores a serem inseridos
    const resultado = await db.query(consulta, contatos); // Executa a consulta SQL com os valores fornecidos
    res.status(201).json({ mensagem: "Contato criado com sucesso!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao inserir contato:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.put("/contato/:id_contato", async (req, res) => {
  console.log("Rota PUT /contato solicitado"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id_contato = req.params.id_contato; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    let consulta = "SELECT * FROM contato WHERE id_contato = $1"; // Consulta SQL para selecionar a questão pelo ID
    let resultado = await db.query(consulta, [id_contato]); // Executa a consulta SQL com o ID fornecido
    let contatos = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se a imagem foi encontrada
    if (contatos.length === 0) {
      return res.status(404).json({ message: "Contato não encontrado" }); // Retorna erro 404 se a questão não for encontrada
    }

    const data = req.body; // Obtém os dados do corpo da requisição

    // Usa o valor enviado ou mantém o valor atual do banco
    data.instagram = data.instagram|| contatos[0].instagram;
    data.facebook = data.facebook|| contatos[0].facebook;
    data.whatsapp = data.whatsapp|| contatos[0].whatsapp;
    data.email = data.email|| contatos[0].email;
    // Atualiza o contato
    consulta = "UPDATE contato SET instagram = $1, facebook = $2, whatsapp = $3, email = $4 WHERE id_contato = $5";
    // Executa a consulta SQL com os valores fornecidos
    resultado = await db.query(consulta, [
      data.instagram,
      data.facebook,
      data.whatsapp,
      data.senha,
      id_contato,
    ]);

    res.status(200).json({ message: "Contato atualizado com sucesso!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao atualizar o contato:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
});

