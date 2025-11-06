CREATE TABLE administrador (
    id_admin SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE contato (
    id_contato SERIAL PRIMARY KEY,
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    whatsapp VARCHAR(20),
    email VARCHAR(255),
);

CREATE TABLE imagem (
    id_imagem SERIAL PRIMARY KEY,
    link_img VARCHAR(500) NOT NULL,  
);
