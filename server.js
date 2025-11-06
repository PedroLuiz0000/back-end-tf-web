// ######
// Local onde os pacotes de dependências serão importados
// ######
import express from "express";      // Requisição do pacote do express

// ######
// Local onde as configurações do servidor serão feitas
// ######
const app = express();              // Instancia o Express
const port = 3000;                  // Define a porta

// ######
// Local onde as rotas (endpoints) serão definidas
// ######
app.get("/", (req, res) => {        
  // Rota raiz do servidor
  // Rota GET /
  // Esta rota é chamada quando o usuário acessa a raiz do servidor
  // Ela retorna uma mensagem com informações do projeto

  console.log("Rota GET / solicitada"); // Log no terminal para indicar que a rota foi acessada
  
  // Responde com um JSON contendo uma mensagem
  res.json({
		descricao: "API para ___",    // Substitua pelo conteúdo da sua API
    autor: "Seu_nome_completo",     // Substitua pelo seu nome
  });
});

// ######
// Local onde o servidor escutar as requisições que chegam
// ######
app.listen(port, () => {
  console.log(Serviço rodando na porta:  ${port});
});

app.get("/imagens", async (req, res) => {
  //server.js
  const db = conectarBD(); 
  console.log("Rota GET /imagens solicitada"); 
 
  try {
    const resultado = await db.query("SELECT * FROM imagens"); 
    const dados = resultado.rows; 
    res.json(dados); 
  } catch (e) {
    console.error("Erro ao buscar imagens:", e); 
    res.status(500).json({
      erro: "Erro interno do servidor",
      mensagem: "Não foi possível buscar as imagens",
    });
  }
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

    consulta = "DELETE FROM questoes WHERE id = $1"; // Consulta SQL para deletar a imagem pelo ID
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
    if (!data.link_imagem) {
      return res.status(400).json({
        erro: "Dados inválidos",
        mensagem:
          "O campo contendo o link da imagem é obrigatório",
      });
    }

    const db = conectarBD(); // Conecta ao banco de dados

    const consulta =
      "INSERT INTO imagens(link_imagem) VALUES ($1) "; // Consulta SQL para inserir a questão
    const imagem = [data.link_imagem]; // Array com os valores a serem inseridos
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
    consulta = "UPDATE imagens SET link_imagem = $1 WHERE id = $2";
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