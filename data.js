// ==========================================
// DADOS DOS PRODUTOS
// Este arquivo simula um banco de dados
// ==========================================

const produtos = [
    // CAFÉS QUENTES
    {
        id: 1,
        nome: 'Espresso Clássico',
        categoria: 'cafes',
        descricao: 'Café expresso tradicional italiano, forte e encorpado com crema dourada',
        preco: 6.50,
        imagem: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop&q=80',
        destaque: true
    },
    {
        id: 2,
        nome: 'Cappuccino Tradicional',
        categoria: 'cafes',
        descricao: 'Espresso com leite vaporizado e espuma cremosa, finalizado com cacau',
        preco: 9.50,
        imagem: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop&q=80',
        destaque: true
    },
    {
        id: 3,
        nome: 'Café Latte',
        categoria: 'cafes',
        descricao: 'Espresso suave com bastante leite vaporizado e uma fina camada de espuma',
        preco: 10.00,
        imagem: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=400&fit=crop&q=80',
        destaque: true
    },
    {
        id: 4,
        nome: 'Café Americano',
        categoria: 'cafes',
        descricao: 'Espresso duplo diluído em água quente, mantendo todo o sabor',
        preco: 7.50,
        imagem: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 5,
        nome: 'Macchiato',
        categoria: 'cafes',
        descricao: 'Espresso marcado com uma pequena porção de espuma de leite',
        preco: 7.00,
        imagem: 'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 6,
        nome: 'Flat White',
        categoria: 'cafes',
        descricao: 'Espresso duplo com microespuma aveludada de leite, estilo australiano',
        preco: 11.00,
        imagem: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 7,
        nome: 'Mocha',
        categoria: 'cafes',
        descricao: 'Espresso com calda de chocolate belga, leite vaporizado e chantilly',
        preco: 12.50,
        imagem: 'https://images.unsplash.com/photo-1578374173705-9cb1941c9877?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    
    // BEBIDAS GELADAS
    {
        id: 8,
        nome: 'Iced Latte',
        categoria: 'bebidas',
        descricao: 'Espresso gelado com leite cremoso e gelo, refrescante e saboroso',
        preco: 11.00,
        imagem: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 9,
        nome: 'Cold Brew',
        categoria: 'bebidas',
        descricao: 'Café extraído a frio por 16 horas, sabor suave e doce natural',
        preco: 13.00,
        imagem: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 10,
        nome: 'Frappuccino',
        categoria: 'bebidas',
        descricao: 'Bebida gelada batida com café, leite, gelo e chantilly',
        preco: 14.50,
        imagem: 'https://images.unsplash.com/photo-1562155618-e1a8bc2eb04f?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 11,
        nome: 'Affogato',
        categoria: 'bebidas',
        descricao: 'Sorvete de creme afogado em espresso quente, uma sobremesa perfeita',
        preco: 15.00,
        imagem: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 12,
        nome: 'Chocolate Gelado',
        categoria: 'bebidas',
        descricao: 'Chocolate belga batido com leite gelado e chantilly',
        preco: 12.00,
        imagem: 'https://images.unsplash.com/photo-1542990253-a781e04c0082?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    
    // ACOMPANHAMENTOS
    {
        id: 13,
        nome: 'Croissant Tradicional',
        categoria: 'acompanhamentos',
        descricao: 'Croissant francês folhado, crocante por fora e macio por dentro',
        preco: 8.50,
        imagem: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 14,
        nome: 'Pão de Queijo',
        categoria: 'acompanhamentos',
        descricao: 'Autêntico pão de queijo mineiro, quentinho e sequinho',
        preco: 6.00,
        imagem: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 15,
        nome: 'Bolo de Cenoura',
        categoria: 'acompanhamentos',
        descricao: 'Bolo caseiro de cenoura com cobertura de chocolate',
        preco: 9.00,
        imagem: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 16,
        nome: 'Brownie Artesanal',
        categoria: 'acompanhamentos',
        descricao: 'Brownie denso com chocolate 70% cacau e nozes',
        preco: 10.50,
        imagem: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 17,
        nome: 'Torta de Limão',
        categoria: 'acompanhamentos',
        descricao: 'Torta cremosa de limão com merengue suíço',
        preco: 11.00,
        imagem: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 18,
        nome: 'Cookie Americano',
        categoria: 'acompanhamentos',
        descricao: 'Cookie crocante com gotas de chocolate ao leite',
        preco: 7.50,
        imagem: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 19,
        nome: 'Cheesecake',
        categoria: 'acompanhamentos',
        descricao: 'Cheesecake cremoso com calda de frutas vermelhas',
        preco: 13.50,
        imagem: 'https://images.unsplash.com/photo-1533134242820-b4f3c128b34e?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 20,
        nome: 'Sanduíche Natural',
        categoria: 'acompanhamentos',
        descricao: 'Sanduíche de pão integral com frango, alface e tomate',
        preco: 12.00,
        imagem: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    
    // GRÃOS DE CAFÉ
    {
        id: 21,
        nome: 'Café em Grãos 250g',
        categoria: 'graos',
        descricao: 'Grãos arábica premium torrados artesanalmente, torra média',
        preco: 32.00,
        imagem: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 22,
        nome: 'Café em Grãos 500g',
        categoria: 'graos',
        descricao: 'Blend especial de grãos arábica e robusta, torra escura',
        preco: 58.00,
        imagem: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 23,
        nome: 'Café Gourmet 1kg',
        categoria: 'graos',
        descricao: '100% arábica de origem única, notas de chocolate e caramelo',
        preco: 98.00,
        imagem: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 24,
        nome: 'Café Moído 250g',
        categoria: 'graos',
        descricao: 'Café moído na hora, moagem média para filtro e prensa francesa',
        preco: 28.00,
        imagem: 'https://images.unsplash.com/photo-1585650964051-1c6f8e4b5767?w=400&h=400&fit=crop&q=80',
        destaque: false
    },
    {
        id: 25,
        nome: 'Café Especial 500g',
        categoria: 'graos',
        descricao: 'Grãos especiais pontuação 85+, torra clara com notas frutadas',
        preco: 75.00,
        imagem: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=400&fit=crop&q=80',
        destaque: false
    }
];

// Categorias disponíveis
const categorias = [
    { id: 'all', nome: 'Todas' },
    { id: 'cafes', nome: 'Cafés' },
    { id: 'bebidas', nome: 'Bebidas' },
    { id: 'acompanhamentos', nome: 'Acompanhamentos' },
    { id: 'graos', nome: 'Grãos' }
];