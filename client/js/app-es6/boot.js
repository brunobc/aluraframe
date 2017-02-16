import {NegociacaoController} from './controllers/NegociacaoController';
let negociacaoController = new NegociacaoController();

document.querySelector('.form').onsubmit = negociacaoController.adiciona.bind(negociacaoController);
document.querySelector('button[type=button]').onclick = negociacaoController.apaga.bind(negociacaoController);