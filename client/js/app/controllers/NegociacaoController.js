class NegociacaoController {

    constructor() {
        let $ = document.querySelector.bind(document);

        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        this._ordemAtual = '';

        this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacoesView($('#negociacoesView')), 'adiciona', 'esvazia', 'ordena', 'inverteOrdem');

        this._mensagem = new Bind(new Mensagem(), new MensagemView($('#mensagemView')), 'texto');

        this._negociacaoService = new NegociacaoService();

        this._init();
    }

    _init() {
        this._negociacaoService.lista().then(negociacoes => negociacoes.forEach(dado => this._listaNegociacoes.adiciona(new Negociacao(dado._data, dado._quantidade, dado._valor)))).catch(erro => {
            this._mensagem.texto = erro;
        });

        setInterval(() => {
            console.log('Importando negociações');
            this.importaNegociacoes();
        }, 3000);
    }

    adiciona(event) {
        event.preventDefault();

        let negociacao = this._criaNegociacao();

        this._negociacaoService.cadastra(negociacao).then(mensagem => {
            this._listaNegociacoes.adiciona(negociacao);
            this._mensagem.texto = mensagem;
            this._limpaFormulario();
        }).catch(erro => this._mensagem.texto = erro);
    }

    apaga() {
        this._negociacaoService.apagaTodas().then(mensagem => {
            this._listaNegociacoes.esvazia();
            this._mensagem.texto = mensagem;
        }).catch(erro => this._mensagem.texto = erro);
    }

    importaNegociacoes() {
        this._negociacaoService = new xNegociacaoService();

        this._negociacaoService.importa(this._listaNegociacoes.negociacoes).then(negociacoes => negociacoes.forEach(negociacao => {
            this._listaNegociacoes.adiciona(negociacao);
            this._mensagem.texto = 'Negociações do período importadas';
        })).catch(erro => this._mensagem.texto = erro);
    }

    ordena(coluna) {
        if (this._ordemAtual == coluna) {
            this._listaNegociacoes.inverteOrdem();
        } else {
            this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
        }
        this._ordemAtual = coluna;
    }

    _criaNegociacao() {
        return new Negociacao(DateHelper.textoParaData(this._inputData.value), parseInt(this._inputQuantidade.value), parseFloat(this._inputValor.value));
    }

    _limpaFormulario() {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();
    }
}
//# sourceMappingURL=NegociacaoController.js.map