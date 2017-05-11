var fs = require('fs');
var parser;
var nomeArquivo = process.argv[2];
var extensao;
var numeros = [];
var intervalos = [];

init();

function init(){
	extensao = verificarExtensao(nomeArquivo);
	numeros = parseArquivo(nomeArquivo, extensao);
	intervalos = instanciarIntervalos(numeros);
	escreverIntervalos(intervalos);
	process.exit(0);
}

function verificarExtensao(nomeArquivo){
	var i = nomeArquivo.lastIndexOf('.');
	return nomeArquivo.substring(i+1);
}

function parseArquivo(nomeArquivo, extensao)
{
	var resultado;
	if(extensao == "json"){
		resultado = require("./" + nomeArquivo);
		resultado.sort(function(a, b){return a-b});
	}

	else if(extensao == "csv"){
		parser = require('csv-string');
		resultado = parseCSV(nomeArquivo);
		resultado.sort(function(a, b){return a-b});
	}

	else if(extensao == "xml"){
		parser = require('xml2js').parseString;
		resultado = parseXML(nomeArquivo);
		resultado.sort(function(a, b){return a-b});
	}

	else{
		console.log("Você passou um arquivo em formato inválido.");
		process.exit(1);
	}
	return resultado;
}

function parseCSV(nomeArquivo){
	var arr = [];
	var arquivo = __dirname + "\\" + nomeArquivo;
	var resultado = parser.parse(fs.readFileSync(arquivo, 'utf-8'));
	for (var i = 0; i < resultado.length; i++) {
		arr.push(parseInt(resultado[i][0]));
	};
	return arr;
}

function parseXML(nomeArquivo){
	var arr = [];
	var arquivo = __dirname + "\\" + nomeArquivo;
	var data = fs.readFileSync(arquivo, 'utf-8');
	parser(data, function(err, resultado){
		for (var i = 0; i < resultado.numeros.numero.length; i++) {
			arr.push(parseInt(resultado.numeros.numero[i]['$'].value));
		};
	});
	return arr;
}

function instanciarIntervalos(numeros){
	var intervalo = [];
	var intervalos = [];
	var primeiro = true;
	var n0;
	var n1;
	// Isso não funciona.
	// 1. Verifica o primeiro número, põe-o no intervalo.
	// 2. Verifica o segundo numero.
	// 3. LOOP 
	// 	3.1 Se o numero for o primeiro mais um, poe o segundo numero no intervalo.
	//	3.2 Verifica o proximo.
	// 	3.2 Se não for, finaliza o intervalo e poe-o no array. Sai do loop.
	// 
	for (var i = 0; i <= numeros.length; i++) {
		if (n0 == undefined)
			n0 = numeros[i];
		else if (numeros[i] == numeros[i-1] + 1)
			n1 = numeros[i];
		else if (i == numeros.length){
			intervalo.push(n0);
		}
		else {
			console.log("Caiu no else");
			intervalo.push(n0);
			if(n1 != undefined)
				intervalo.push(n1);
			intervalos.push(intervalo);
			n0 = numeros[i];
			console.log(n0);
			n1 = undefined;
			intervalo = [];
		}

	};
	intervalos.push(intervalo);
	return intervalos;
}

function escreverIntervalos(intervalos){
	var nomeArquivo = "saida.txt";
	var data = "";
	var separador = "-";
	var separador2 = ", ";
	for (var i = 0; i < intervalos.length; i++) {
		data += intervalos[i][0];
		if(intervalos[i][1] != undefined){
			data += separador + intervalos[i][1];
		}
		data += separador2;
	}
	data = data.substring(0, (data.length - 2));
	fs.writeFileSync(nomeArquivo, data);
	console.log("Arquivo escrito.");
}
