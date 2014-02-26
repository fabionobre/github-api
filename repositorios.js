function Repositorios() {

	this.listaRepositorio = new Array();
	this.paginaAtual = 1;
	this.selecionado = -1;
	
	this.add = function(repositorio) {
		for (var i=0; i < this.listaRepositorio.length; i++) {
			if (this.listaRepositorio[i].stargazers_count < repositorio.stargazers_count) {
				this.listaRepositorio.splice(i, 0, repositorio);
				return;
			}
		}
		this.listaRepositorio.push(repositorio);
	}

	this.exibePagina = function(pagina) {

		if (pagina > 0 && pagina <= this.paginas()) {

			this.paginaAtual = pagina;

			$("#lista_repositorios").html("");

			var start = (pagina-1) * 20;
			var end = start+20;

			if (end > this.listaRepositorio.length) {
				end = this.listaRepositorio.length;
			}

			for (var id=start; id < end; id++) {
				$("#lista_repositorios").append('<li id="repositorio-' + id + '"><a href="javascript:;" onclick="carregaCommits(\'' + id + '\')";>' + repositorios.listaRepositorio[id].name + "</a></li>");		
			}

			$('#lista_repositorios').find('#repositorio-' + this.selecionado).addClass('selecionado');
		}

		$('#repositorio_pagina_seguinte').show();
		$('#repositorio_pagina_anterior').show();

		if (pagina >= this.paginas()) {
			$('#repositorio_pagina_seguinte').hide();
		} 

		if (pagina <= 1) {
			$('#repositorio_pagina_anterior').hide();
		} 
	}

	this.exibeProximaPagina = function() {

		this.exibePagina(this.paginaAtual+1);
	}

	this.exibePaginaAnterior = function() {

		this.exibePagina(this.paginaAtual-1);	
	}

	this.paginas = function() {
		var total = this.listaRepositorio.length;
		var paginas = ~~(total / 20);

		if (total % 20 > 0) {
			paginas++;
		}

		return paginas;
	}
};