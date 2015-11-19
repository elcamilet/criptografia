
//	--------------------------------------------------------------------------------
//	CRIPTOGRAFIA - Julia Igual Nevot
//	--------------------------------------------------------------------------------
//
//	Quan es carrega la web s'omplen les llistes amb els nombres primers indicats.
//

window.onload = function ()
{
    var primers = [37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    omple_llista("llista_primers",primers);
    omple_llista("llista_primers_2",primers);
}

function omple_llista(llista,arr) {
    var sel = document.getElementById(llista);
    for(var i = 0; i < arr.length; i++) {
	var opt = document.createElement('option');
	opt.innerHTML = arr[i];
	opt.value = arr[i];
	sel.appendChild(opt);
    }
}

//	--------------------------------------------------------------------------------
//	Part superior de la web
//	--------------------------------------------------------------------------------

var calculat = false;

function calcula_modul() {
    p = document.formulari.llista_primers.value;
    q = document.formulari.llista_primers_2.value;
    m = p*q;
    document.getElementById("unout").innerHTML = ""; //Buida la sortida
    sortida("El teu mòdul es " + m,"unout");
    document.getElementById("modul").value = m;
    document.getElementById("modul_2").value = m;
    euler = (p - 1) * (q - 1);
    var coprimers = [];
    var expo = [];
    var i = 1;
    //sortida("Euler es " + euler,"unout");
    while (i<euler) {
	if (euler%i != 0) {
	    coprimers.push(i);
	}
	i++;
    }
    i=0;
    while (i<coprimers.length) {
	a = coprimers[i].toString();
	if (a.length == 3) {
	    if (mcd(euler,coprimers[i])==1) {
		expo.push(coprimers[i]);
	    }
	}
	i++;
    }
    omple_llista("exponent_public",expo);
    document.formulari.euler.value = euler;
    calculat=true;
}

function mcd(x,y) {		// Calculem el m.c.d
    gx=x;
    gy=y;
    while (y != 0) {
	w = x % y;
	x = y;
	y = w;
    }
    return x;
}

function bezout(expo, euler) {
    if (!calculat) {
	alert("Primer has de calcular el mòdul.");
	return;
    }
    var var1 = euler;
    var var2 = expo;
    var cont = 0;
    var result = [];
    var flag = 0;
    var binasc = [];
    var bindesc = [];
    var varaux = 0;
    var resto = [];
    var up = [];
    var down = [];

    while (flag==0) {
	cont++;
	result[cont]=Math.floor(var1/var2);
	resto[cont]=var1%var2;
	if (resto[cont]==0 || cont>200) {
	    flag=1;
	    if (cont==0) {
		mcd=var2;
		a=0;
		b=1;
	    }
	}
	var1=var2;
	var2=resto[cont];
    }
    //Calculem Id. Bezout
    binasc[1]=0;
    binasc[2]=1;
    bindesc[1]=1;
    bindesc[2]=0;
    for (i=0; i<=(cont-1); i++) {
	varaux=result[i+1]*binasc[1]+binasc[2];
	//sortida("varaux inicio " + varaux + " = " + result[i] + " * " + binasc[1] + " + " + binasc[2],"unout");
	binasc[2]=binasc[1];
	binasc[1]=varaux;
	up[i]=varaux;
    }
    for (i=0; i<=(cont-1); i++) {
	varaux=result[i+1]*bindesc[1]+bindesc[2];
	bindesc[2]=bindesc[1];
	bindesc[1]=varaux;
	down[i]=varaux;
    }

    final = (1+(binasc[2]*down[i-1]))/up[i-1];
    if (final%Math.floor(final)!=0) {
	final = down[i-1] - Math.floor(final);
    }
    sortida("Clau privada: " + final,"unout");
    sortida("Clau pública: " + expo,"unout");
    document.getElementById("clau_publica").value = expo;
 	document.getElementById("clau_privada").value = final;
}

function copia_a_desencriptar(valor) {
  document.getElementById("frase_xifrada").value = valor;
}

//	--------------------------------------------------------------------------------
//	Part central de la web
//	--------------------------------------------------------------------------------


function codifica(frase) {
    document.getElementById("dosout").innerHTML = ""; //Buida la sortida
    document.getElementById("dosoutbis").innerHTML = ""; //Buida la sortida
    //	Control·lem els possibles errors
    if (document.formulari.clau_publica.value == "" || document.formulari.modul.value == "" || document.formulari.frase.value == "") {
	alert("El mòdul, la clau pública o la frase estan buits.\nNo poden estar-ho.");
	return;
    }
    if (!verifica_codi(document.formulari.clau_publica.value)) {
	alert("La clau pública ha de ser numèrica.");
	return;
    }
    if (!verifica_codi(document.formulari.modul.value)) {
	alert("El mòdul ha de ser numèric.");
	return;
    }
    if (!verifica_frase(frase)) {
	alert("La frase introduida conté caràcters no vàlids.\nNomés es permeten lletres sense accents, comes, espais i punts.");
	return;
    }
    // Si no hi ha errors, procedim a codificar
    if (frase.length%3==1) { frase = frase.concat("**"); }
    if (frase.length%3==2) { frase = frase.concat("*"); }
    array_frase_separada = separa_lletres(frase);
    array_frase_numerica = lletres_a_numeros(array_frase_separada);
    cadena_numerica = array_frase_numerica.join("");
    array_numeric = talla_cadena(cadena_numerica,3,"dosout");
    frase_encriptada = encripta (array_numeric);
    sortida("<b>" + frase_encriptada + "</b>","dosoutbis");
}

function separa_lletres(string) {
    var arr=[];
    for (var i=0;i<string.length;i++ ) {
	arr.push(string.slice(i,i+1));
    }
    sortida(arr,"dosout");
    return arr;
}

function lletres_a_numeros(array) {
    for (var i=0;i<array.length;i++) {
	array.splice(i,1,equival(array[i]));
    }
    sortida(array,"dosout");
    return array;
}

function encripta(array) {
    var resultat="";

    for (var i=0;i<array.length;i++) {
	resultat = resultat.concat(algoritme_encriptacio(array[i]));
    }
    return resultat;

}

function algoritme_encriptacio(b){
    var a=1;
    var e=document.formulari.clau_publica.value;
    var m=document.formulari.modul.value;
    while (e>2) {
	if (e%2!=0) {	// quan l’exponent és senar
	    e=e-1;	// fem que l’exponent sigui parell
	    e=e/2;	// el dividim entre dos
	    a=a*b;	// és el b que necessitem per que b * (b elevat a c/2)
	    a=a%m;	// modul de a
	    b=b*b;	// base al quadrat
	    b=b%m;	// modul de b
	    sortida(a + " * " + b + " elevat a " + e,"dosout");
	}
	else{		// quan l’exponent és parell
	    e=e/2;
	    b=b*b;
	    b=b%m;
    	    sortida(a + " * " + b + " elevat a " + e,"dosout");
	}
    }
    resultat = (a * (Math.pow(b,e) % m))%m;
    resultat = resultat.toString();
    if (resultat.length <4){			// Afegim zeros als resultats menors de 4 xifres
	switch (resultat.length) {
	    case 1:				// En cas de que tingui una xifra, l'hi afegim 3 zeros
		resultat = "000" + resultat;
		break;
	    case 2:				// En cas de que tingui dues xifres, l'hi afegim 2 zeros
		resultat = "00" + resultat;
		break;
	    case 3:				// En cas de que tingui tres xifres, l'hi afegim 1 zero
		resultat = "0" + resultat;
		break;
	    default:
		break;
	}
    }
    sortida("<b>" + resultat + "</b>","dosout");
    return resultat;
}

function verifica_frase(fra){
    for (var i=0;i<fra.length;i++ ) {
	a = fra.slice(i,i+1);
	if (equival(a)=="" || equival(a)=="99") {
	    return false;
	}
    }
    return true;
}

//	--------------------------------------------------------------------------------
//	Part inferior de la web
//	--------------------------------------------------------------------------------

function descodifica(frase_encriptada) {
    var arr = [];
    var resultat = "";
    var res = "";
    document.getElementById("tresout").innerHTML = ""; //Buida la sortida
    document.getElementById("tresoutbis").innerHTML = ""; //Buida la sortida
    //	Control·lem els possibles errors
    if (document.formulari.clau_privada.value == "" || document.formulari.modul_2.value == "" || document.formulari.frase_xifrada.value == "") {
	alert("El mòdul, la clau privada o el codi estan buits.\nNo poden estar-ho.");
	return;
    }
    if (!verifica_codi(document.formulari.clau_privada.value)) {
	alert("La clau privada ha de ser numèrica.");
	return;
    }
    if (!verifica_codi(document.formulari.modul_2.value)) {
	alert("El mòdul ha de ser numèric.");
	return;
    }
    if (!verifica_codi(frase_encriptada)) {
	alert("El codi ha de ser numèric.");
	return;
    }
    // Si no hi ha errors, procedim a descodificar
    arr = talla_cadena(frase_encriptada,4,"tresout");
    for (i=0;i<arr.length;i++)
    {
	res = algoritme_desencriptacio(arr[i],document.formulari.clau_privada.value,document.formulari.modul_2.value);
	sortida("<b>"+res+"</b>","tresout");
	resultat = resultat.concat(res);
    }
    sortida(resultat,"tresout");
    arr = talla_cadena(resultat,2,"tresout");
    for (i=0;i<arr.length;i++)
    {
	arr[i] = equival(arr[i]);
    }
    //frase = arr.toString();
    frase = arr.join("");
    frase = frase.replace("*","");
    frase = frase.replace("*","");
    sortida("<b>" + frase + "</b>","tresoutbis");


}


function algoritme_desencriptacio(b, c, m) {  //  b =  frase_encriptada;  c = clau_privada;   m = modul_2;
    a = 1;
    while (c>2) {
	if (c%2!=0) {   // quan l’exponent és senar
	    c=c-1;    	// fem que l’exponent sigui parell
	    c=c/2;    	// el dividim entre dos
	    a=a*b;    	// és el b que necessitem per que b * (b elevat a c/2)
	    a=a%m;  	// modul de a
	    b=b*b;    	// base al quadrat
	    b=b%m;    	// modul de b
	    sortida(a + " * " + b + " elevat a " + c,"tresout");
	}
	else{      	// quan l’exponent és parell
	    c=c/2;
	    b=b*b;
	    b=b%m;
    	    sortida(a + " * " + b + " elevat a " + c,"tresout");
	}
    }
    resultat = (a * (Math.pow(b,c) % m))%m;
    resultat = resultat.toString();
    if (resultat.length <3){		// Afegim zeros als resultats menors de 3 xifres
	switch (resultat.length) {
	    case 1:			// En cas de que tingui una xifra, l'hi afegim 2 zeros
		resultat = "00" + resultat;
		break;
	    case 2:			// En cas de que tingui dues xifres, l'hi afegim 1 zero
		resultat = "0" + resultat;
		break;
	    default:
		break;
	}
    }
    return resultat;
}

//	Verifica que el codi només contingui numeros

function verifica_codi(cod) {
    for (var i=0;i<cod.length;i++ ) {
	a = cod.slice(i,i+1);
	if (a != "0" & a != "1" & a != "2" & a != "3" & a != "4" & a != "5" & a != "6" & a != "7" & a != "8" & a != "9") {
	    return false;
	}
    }
    return true;
}

//	--------------------------------------------------------------------------------
//	Funcions comunes a tota la web
//	--------------------------------------------------------------------------------


//	Es talla la cadena de caràcters fent grups de 'n' caràcters,
//	segons l'hi indiquem a la variable 'interval', i ens ho mostra
//	a la sortida que l'hi indiquem a la variable 'surt'

function talla_cadena (cadena, interval, surt) {
    var result = [];
    for (var i=0; i<cadena.length; i+=interval)
    {    result.push(cadena.substring (i, i+interval));
    }
    sortida(result, surt);
    return result;
}

//	Ens mostra els resultats continguts a 'out' a la pantalla, a la
//	posició especificada a 'divout'

function sortida(out,divout){
    document.getElementById(divout).innerHTML = document.getElementById(divout).innerHTML  + out + "<br>";
}

//	Taula d'equivalències de lletres a numeros i viceversa, incloent
//	el caràcter de control '*'. Es passa un caràcter i retorna l'equivalent

function equival(n) {
    switch (n) {

	case 'a':
	    return "00";
	case 'b':
	    return "01";
	case 'c':
	    return "02";
	case 'd':
	    return "03";
	case 'e':
	    return "04";
	case 'f':
	    return "05";
	case 'g':
	    return "06";
	case 'h':
	    return "07";
	case 'i':
	    return "08";
	case 'j':
	    return "09";
	case 'k':
	    return "10";
	case 'l':
	    return "11";
	case 'm':
	    return "12";
	case 'n':
	    return "13";
	case 'o':
	    return "14";
	case 'p':
	    return "15";
	case 'q':
	    return "16";
	case 'r':
	    return "17";
	case 's':
	    return "18";
	case 't':
	    return "19";
	case 'u':
	    return "20";
	case 'v':
	    return "21";
	case 'w':
	    return "22";
	case 'x':
	    return "23";
	case 'y':
	    return "24";
	case 'z':
	    return "25";
	case ' ':
	    return "26";
	case ',':
	    return "27";
	case '.':
	    return "28";
	case '00':
	    return "a";
	case '01':
	    return "b";
	case '02':
	    return "c";
	case '03':
	    return "d";
	case '04':
	    return "e";
	case '05':
	    return "f";
	case '06':
	    return "g";
	case '07':
	    return "h";
	case '08':
	    return "i";
	case '09':
	    return "j";
	case '10':
	    return "k";
	case '11':
	    return "l";
	case '12':
	    return "m";
	case '13':
	    return "n";
	case '14':
	    return "o";
	case '15':
	    return "p";
	case '16':
	    return "q";
	case '17':
	    return "r";
	case '18':
	    return "s";
	case '19':
	    return "t";
	case '20':
	    return "u";
	case '21':
	    return "v";
	case '22':
	    return "w";
	case '23':
	    return "x";
	case '24':
	    return "y";
	case '25':
	    return "z";
	case '26':
	    return " ";
	case '27':
	    return ",";
	case '28':
	    return ".";
	case '*':		// Caràcter de control
	    return "99";
	case '99':		// Caràcter de control
	    return "*";
    	default:
	    return "";
    }
}
