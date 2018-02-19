var fs=require('fs');
var natural = require('natural');
var pos = require('pos');
var wordcount = require('wordcount');
//var Regex = require("regex");
var tokenizer = new natural.WordTokenizer();
var wordbase=0;
var c=0;
var r=0;
var z=" ";
var nn=0, rb=0;


var c1=0;
var wc=0;
var token=" ";
var wcount=0;
var spell=0; 
var nn1=0, rb1=0;  
	
//basefile    
var marks=0;
var text;
var textract = require('textract');
var basefile=function(){
		textract.fromFileWithPath("file1.docx", function( error, text ) {
	// divided into tokens
	    z = tokenizer.tokenize(text);
	//word count
   	    wordbase=wordcount(text);	
	//spell checker
		SpellChecker = require ('spellchecker');
		for(var i in z)
			{
			    r=SpellChecker.isMisspelled(z[i]);
					if(r==true)
					{
						console.log('Misspelled words are:' + r[i]);
					    c++;
					    
					} 
			}
	//noun pronoun and adverb	       
				var words = new pos.Lexer().lex(text);
                var tagger = new pos.Tagger();
                var taggedWords = tagger.tag(words);
                for (i in taggedWords) {
				    var taggedWord = taggedWords[i];
				    var word = taggedWord[0];
				    var tag = taggedWord[1];
				    if(tag=='NN' || tag=='WP' || tag=='PRP')//nouns, pronoun
					    nn++;   
				    if(tag=='RB')//adverbs	
	                    rb++;
				}
			//resolve('success');
			    testfile();
	    });
}

//test document
var content;
var testfile=function(){
	//var promise= new Promise(function(resolve,reject){
	textract.fromFileWithPath("file.txt", function( error,content) {
	         	var natural = require('natural');
	        	var tokenizer = new natural.WordTokenizer();
			    token = tokenizer.tokenize(content);
	//word count
				wc=wordcount(content);
				if(wc>=(wordbase-500) && wc<=(wordbase+500))
					wcount=wc;
				
	//spell checker
				SpellChecker = require ('spellchecker');
					for(var i in token)
					{
					    spell=SpellChecker.isMisspelled(token[i]);
					    if(spell==true)
					    {
					     	c1++;
					     	console.log('Misspelled words are:' + spell[i]);
					   	} 
					}
	//noun, pronoun and adverb			        
		        
				    var words = new pos.Lexer().lex(content);
					var tagger = new pos.Tagger();
					var taggedWords = tagger.tag(words);
					for (i in taggedWords) {
					    var taggedWord = taggedWords[i];
					    var word = taggedWord[0];
					    var tag = taggedWord[1];
					    if(tag=='NN' || tag=='WP' || tag=='PRP')//nouns, pronoun
						    nn1++;   
					    if(tag=='RB')//adverbs	
		                    rb1++;
		            }		
			      res();
	    });
	  
}	
//string matching
/*var match=0;
for (var i = 0; i < text.length; i++)
{
    for (var j = 0; j <content.length; j++)
	{              
        if (text[i] == content[j])
                  { 
                      match++;
                  }
    }
}   
           var per=0;
           if (match <= text.length)
               per = (match * 100) / text.length;
           else
               per = 100;
    
	
console.log("matched: "+match);
console.log("percentage: " + per)*/
function res(){
	console.log("\nBase doucument");
    console.log("\nWord count: " + wordbase);
 	console.log('number of misspelled words are:'+ c);
 	console.log("noun: " +nn);
	console.log("Adverbs: "+rb);


    console.log("\nTest doucument");
	console.log("\nWord count of test document: " + wcount);
 	console.log('number of misspelled words are:'+ c1);
 	console.log("noun: " +nn1);
    console.log("Adverbs: "+rb1);
    out();
}
function out(){
   
    var result={
	   	 base:
	   	 {
	   	    word_count: wordbase,
	   	    nouns: nn,
	   	    adverbs:rb,
	   	    spelling:c

	     },
	     test:
	     {
	       word_count: wcount,
	   	    nouns: nn1,
	   	    adverbs:rb1,
	   	    spelling:c1     	
	     }
	}
    var json= JSON.stringify(result,null,2);
    fs.writeFile('output.json',json,'utf8',(err)=>{
		if(err){
			console.log("Error "+err);
			return;
		};
    console.log(result);

    });
}

basefile();
