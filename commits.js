function Commits(repositorio) {

	this.listaPaginas = {};
	this.repositorio = repositorio;
	this.paginaAtual = 1;
	this.paginaFinal = -1;
	
	this.add = function(pagina, commits) {
		this.listaPaginas[pagina] = commits;
	}
	
	this.carregaCommits = function(pagina, funcao) {
	
		funcaoPai = this;
		commitsPaginaAnterior = this.listaPaginas[pagina-1];
		var param =  "";
		
		if (commitsPaginaAnterior != null) {
			param = "&until=" + commitsPaginaAnterior[commitsPaginaAnterior.length-1].commit.author.date;
		}
					
		// console.log("https://api.github.com/repos/globocom/" + this.repositorio + "/commits?per_page=20" + param);					
		var jqxhr = $.get( "https://api.github.com/repos/globocom/" + this.repositorio + "/commits?per_page=20" + param, function() {

			}).done(function(data) {
								
				funcaoPai.add(pagina, data);

				if (data.length == 0) {
					funcaoPai.paginaFinal = pagina-1;
					return;
				} else if (data.length < 20) {
					funcaoPai.paginaFinal = pagina;
				}
				
				if (funcao == "exibePrimeiraPagina") {
					funcaoPai.exibePrimeiraPagina();
				}
				
			}).fail(function() {
			}).always(function() {
		});			
	}	

	this.exibePrimeiraPagina = function() {

		this.exibePaginaAtual(1);
		this.carregaProximaPagina();
	}

	this.exibePaginaAtual = function(pagina) {

		$("#lista_commits").html("");

		for (var id in this.listaPaginas[pagina]) {

			commit = this.listaPaginas[pagina][id];

			if (commit.author == null) {
				commit.author = "";
				commit.author.avatar_url = "";						
				commit.author.login = "";
			}

			$("#lista_commits").append('<li><img src="' + commit.author.avatar_url + '" width="40" height="40"><span>' + this.formataData(commit.commit.author.date) + '</span><b>' + commit.commit.author.name + '</b><small>@' + commit.author.login + '</small></li>');	
		}

		if (this.paginaAtual >= this.paginaFinal && this.paginaFinal > 0) {
			$("#proximaPagina").hide();
		} else {
			$("#proximaPagina").show();
		}		
	}

	this.formataData = function(data) {

		d = new Date(data);
		return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
	}

	this.carregaProximaPagina = function() {
		
		if (this.paginaFinal < 0) {
			this.carregaCommits(this.paginaAtual+1, "");
		}
	}

	this.proximaPagina = function() {

		this.paginaAtual++;				

		if (this.listaPaginas != null && this.listaPaginas[this.paginaAtual] != null) {		

			this.exibePaginaAtual(this.paginaAtual);		
			

		 	if (this.paginaAtual >= this.paginaFinal && this.paginaFinal > 0) {
				$("#proximaPagina").hide();
		 	} else {
				this.carregaProximaPagina();		 		
		 	}
		} 				
	}
	
	funcaoPai = this;
	this.carregaCommits(1, "exibePrimeiraPagina");			
};		