-- ============================================================
-- Banco de Dados: bd_cafeteria
-- Sistema de Pedidos - Café Artesanal
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- ============================================================
-- TABELA: tb_categoria
-- ============================================================

CREATE TABLE IF NOT EXISTS `tb_categoria` (
  `ID_CATEGORIA` int(11) NOT NULL AUTO_INCREMENT,
  `NOME_CATEGORIA` varchar(50) NOT NULL,
  `SLUG_CATEGORIA` varchar(50) NOT NULL,
  PRIMARY KEY (`ID_CATEGORIA`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `tb_categoria` (`ID_CATEGORIA`, `NOME_CATEGORIA`, `SLUG_CATEGORIA`) VALUES
(1, 'Cafés', 'cafes'),
(2, 'Bebidas', 'bebidas'),
(3, 'Acompanhamentos', 'acompanhamentos'),
(4, 'Grãos', 'graos');

-- ============================================================
-- TABELA: tb_produto
-- ============================================================

CREATE TABLE IF NOT EXISTS `tb_produto` (
  `ID_PRODUTO` int(11) NOT NULL AUTO_INCREMENT,
  `COD_CATEGORIA` int(11) DEFAULT NULL,
  `NOME_PRODUTO` varchar(100) NOT NULL,
  `DESCRICAO_PRODUTO` varchar(255) DEFAULT NULL,
  `IMAGEM_PRODUTO` varchar(500) DEFAULT NULL,
  `VALOR_UNITARIO_PRODUTO` decimal(7,2) NOT NULL,
  `DESTAQUE` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ID_PRODUTO`),
  KEY `COD_CATEGORIA` (`COD_CATEGORIA`),
  CONSTRAINT `tb_produto_ibfk_1` FOREIGN KEY (`COD_CATEGORIA`) REFERENCES `tb_categoria` (`ID_CATEGORIA`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `tb_produto` (`ID_PRODUTO`, `COD_CATEGORIA`, `NOME_PRODUTO`, `DESCRICAO_PRODUTO`, `IMAGEM_PRODUTO`, `VALOR_UNITARIO_PRODUTO`, `DESTAQUE`) VALUES
-- Cafés
(1,  1, 'Espresso Clássico',      'Café expresso tradicional italiano, forte e encorpado com crema dourada',           'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop&q=80', 6.50,  1),
(2,  1, 'Cappuccino Tradicional',  'Espresso com leite vaporizado e espuma cremosa, finalizado com cacau',             'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop&q=80', 9.50,  1),
(3,  1, 'Café Latte',              'Espresso suave com bastante leite vaporizado e uma fina camada de espuma',         'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=400&fit=crop&q=80', 10.00, 1),
(4,  1, 'Café Americano',          'Espresso duplo diluído em água quente, mantendo todo o sabor',                     'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop&q=80', 7.50,  0),
(5,  1, 'Macchiato',               'Espresso marcado com uma pequena porção de espuma de leite',                      'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=400&h=400&fit=crop&q=80', 7.00,  0),
(6,  1, 'Flat White',              'Espresso duplo com microespuma aveludada de leite, estilo australiano',            'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop&q=80', 11.00, 0),
(7,  1, 'Mocha',                   'Espresso com calda de chocolate belga, leite vaporizado e chantilly',             'https://images.unsplash.com/photo-1578374173705-9cb1941c9877?w=400&h=400&fit=crop&q=80', 12.50, 0),
-- Bebidas
(8,  2, 'Iced Latte',              'Espresso gelado com leite cremoso e gelo, refrescante e saboroso',                'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop&q=80', 11.00, 0),
(9,  2, 'Cold Brew',               'Café extraído a frio por 16 horas, sabor suave e doce natural',                  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop&q=80', 13.00, 0),
(10, 2, 'Frappuccino',             'Bebida gelada batida com café, leite, gelo e chantilly',                         'https://images.unsplash.com/photo-1562155618-e1a8bc2eb04f?w=400&h=400&fit=crop&q=80', 14.50, 0),
(11, 2, 'Affogato',                'Sorvete de creme afogado em espresso quente, uma sobremesa perfeita',            'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=400&fit=crop&q=80', 15.00, 0),
(12, 2, 'Chocolate Gelado',        'Chocolate belga batido com leite gelado e chantilly',                            'https://images.unsplash.com/photo-1542990253-a781e04c0082?w=400&h=400&fit=crop&q=80', 12.00, 0),
-- Acompanhamentos
(13, 3, 'Croissant Tradicional',   'Croissant francês folhado, crocante por fora e macio por dentro',                'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop&q=80', 8.50,  0),
(14, 3, 'Pão de Queijo',           'Autêntico pão de queijo mineiro, quentinho e sequinho',                          'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=400&h=400&fit=crop&q=80', 6.00,  0),
(15, 3, 'Bolo de Cenoura',         'Bolo caseiro de cenoura com cobertura de chocolate',                            'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&q=80', 9.00,  0),
(16, 3, 'Brownie Artesanal',       'Brownie denso com chocolate 70% cacau e nozes',                                  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop&q=80', 10.50, 0),
(17, 3, 'Torta de Limão',          'Torta cremosa de limão com merengue suíço',                                      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop&q=80', 11.00, 0),
(18, 3, 'Cookie Americano',        'Cookie crocante com gotas de chocolate ao leite',                                'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop&q=80', 7.50,  0),
(19, 3, 'Cheesecake',              'Cheesecake cremoso com calda de frutas vermelhas',                               'https://images.unsplash.com/photo-1533134242820-b4f3c128b34e?w=400&h=400&fit=crop&q=80', 13.50, 0),
(20, 3, 'Sanduíche Natural',       'Sanduíche de pão integral com frango, alface e tomate',                         'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=400&fit=crop&q=80', 12.00, 0),
-- Grãos
(21, 4, 'Café em Grãos 250g',      'Grãos arábica premium torrados artesanalmente, torra média',                    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&q=80', 32.00, 0),
(22, 4, 'Café em Grãos 500g',      'Blend especial de grãos arábica e robusta, torra escura',                       'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop&q=80', 58.00, 0),
(23, 4, 'Café Gourmet 1kg',        '100% arábica de origem única, notas de chocolate e caramelo',                   'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=400&h=400&fit=crop&q=80', 98.00, 0),
(24, 4, 'Café Moído 250g',         'Café moído na hora, moagem média para filtro e prensa francesa',               'https://images.unsplash.com/photo-1585650964051-1c6f8e4b5767?w=400&h=400&fit=crop&q=80', 28.00, 0),
(25, 4, 'Café Especial 500g',      'Grãos especiais pontuação 85+, torra clara com notas frutadas',                'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=400&fit=crop&q=80', 75.00, 0);

-- ============================================================
-- TABELA: tb_usuario
-- ============================================================

CREATE TABLE IF NOT EXISTS `tb_usuario` (
  `ID_USUARIO` int(11) NOT NULL AUTO_INCREMENT,
  `NOME_USUARIO` varchar(100) NOT NULL,
  `TELEFONE_USUARIO` varchar(20) DEFAULT NULL,
  `CPF_USUARIO` varchar(14) NOT NULL,
  `SENHA_HASH` varchar(64) NOT NULL,
  `TIPO_USUARIO` enum('cliente','admin') NOT NULL DEFAULT 'cliente',
  `DATA_CADASTRO` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ID_USUARIO`),
  UNIQUE KEY `uq_cpf` (`CPF_USUARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================
-- ADMIN PADRÃO: CPF 000.000.000-00 / Senha admin123
-- O hash é calculado automaticamente pelo MySQL: SHA256(senha + cpfSemFormatação)
-- ============================================================

SET @admin_hash = SHA2(CONCAT('admin123', '00000000000'), 256);

INSERT IGNORE INTO `tb_usuario`
  (`NOME_USUARIO`, `CPF_USUARIO`, `TELEFONE_USUARIO`, `SENHA_HASH`, `TIPO_USUARIO`)
VALUES
  ('Administrador', '000.000.000-00', '(11) 99999-0000', @admin_hash, 'admin');

-- ============================================================
-- TABELA: tb_pedido
-- ============================================================

CREATE TABLE IF NOT EXISTS `tb_pedido` (
  `ID_PEDIDO` int(11) NOT NULL AUTO_INCREMENT,
  `ID_USUARIO` int(11) DEFAULT NULL,
  `TOTAL_PEDIDO` decimal(7,2) NOT NULL,
  `DATA_PEDIDO` datetime NOT NULL DEFAULT current_timestamp(),
  `STATUS_PEDIDO` varchar(20) NOT NULL DEFAULT 'pendente' COMMENT 'pendente | preparando | entregue | cancelado',
  PRIMARY KEY (`ID_PEDIDO`),
  KEY `fk_pedido_usuario` (`ID_USUARIO`),
  CONSTRAINT `fk_pedido_usuario` FOREIGN KEY (`ID_USUARIO`) REFERENCES `tb_usuario` (`ID_USUARIO`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================
-- TABELA: tb_item_pedido
-- ============================================================

CREATE TABLE IF NOT EXISTS `tb_item_pedido` (
  `ID_ITEM` int(11) NOT NULL AUTO_INCREMENT,
  `COD_PEDIDO` int(11) NOT NULL,
  `ID_PRODUTO` int(11) NOT NULL,
  `QUANTIDADE` int(11) NOT NULL,
  `VALOR_UNITARIO` decimal(10,2) NOT NULL,
  PRIMARY KEY (`ID_ITEM`),
  KEY `fk_item_pedido` (`COD_PEDIDO`),
  KEY `fk_item_produto` (`ID_PRODUTO`),
  CONSTRAINT `fk_item_pedido` FOREIGN KEY (`COD_PEDIDO`) REFERENCES `tb_pedido` (`ID_PEDIDO`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_item_produto` FOREIGN KEY (`ID_PRODUTO`) REFERENCES `tb_produto` (`ID_PRODUTO`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
