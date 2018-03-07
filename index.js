var fs=require('fs');
var natural = require('natural');
//files for finding parts of speech
var path = require("path");
var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';
var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);

//varaiable declaration
var nounbase=0,adjectivebase=0,verbbase=0;
var nountest=0,adjectivetest=0,verbtest=0;
var pre=0;
var tagbase=0, tagtest=0;
var basefile='./documents/basefile.txt';
var testfile='./documents/testfile.txt';
var htmlfile='./documents/htmltag.txt';
//base file read
var basedata = fs.readFileSync(basefile,'utf8');
var baseword= wordCount(basedata);
var tokenbase=basedata.split(/\W+/);
    console.log("Number Of words in base file: "+baseword);

//test file read
var testdata= fs.readFileSync(testfile, 'utf8');
var tokentest=testdata.split(/\W+/);
var testword= wordCount(testdata);
if(testword>=baseword-500 || testword<=baseword+500){
    console.log("Number Of words in test file: "+testword);
}

//html tag file read
var htmldata=fs.readFileSync(htmlfile, 'utf8');
var tokenhtml=htmldata.split(/\W+/);

//word count function
function wordCount(str){
	return str.split(/\W+/).length;
}

//calling functions
matching(tokenbase,tokentest);
pos(tokenbase,"base");
pos(tokentest,"test");

//matching percentage of files
function matching(tokenbase,tokentest){
	var match=0;
    var matches=0;
    for (var i = 0; i < tokenbase.length; i++)
    {
	              
        if(tokenbase.indexOf(tokentest[i],0)===-1)
            { 
               match++;
            }
    }  
    for (var i = 0; i < tokentest.length; i++)
    {
	              
        if(tokentest.indexOf(tokenbase[i],0)===-1)
            { 
                matches++;
            }

    }  
       pre=((match-matches)/match)*100
        //console.log("Matched: "+pre);
}

// parts of speech
function pos(tokens,str){
	var posword=tagger.tag(tokens); 
	for(var i=0;i<tokens.length;i++){
		//for noun
		if(posword[i][1]=='NN'|'NNS'|'NNP'|'NNPS'){
			if(str=="base"){
		     	nounbase++;
		    }
		    if(str=="test"){
		    	nountest++;
		    }
		}
		//for adjectives
		else if(posword[i][1]=='JJ'|'JJS'|'JJR'){
			if(str=="base"){
		     	adjectivebase++;
		    }
		    if(str=="test"){
		    	adjectivetest++;
		    }
		}
		//for verbs
		else if(posword[i][1]=='VB'|'VBD'|'VBG'|'VBN'|'VBP'|'VBZ'){
			if(str=="base"){
		     	verbbase++;
		    }
		    if(str=="test"){
		    	verbtest++;
		    }
		}
	}
}
//searching html tags
for(var i=0; i<tokenhtml.length; i++){
	for(var j=0; j<tokenbase.length; j++){
		if(tokenhtml[i]==tokenbase[j])
		{
			tagbase=tagbase+1;
			break;
	    }
	}	
	for(var j=0; j<tokentest.length; j++)
	{
		if(tokenhtml[i]==tokentest[j])
	    {
			tagtest=tagtest+1;
			break;
		}
	}
}

   
var result={
	base:
	{
	   	word_count: baseword,
	   	nouns: nounbase,
	   	adjectives: adjectivebase,
	   	verbs: verbbase,
	   	keys_found: tagbase

	},
	test:
	{
	    word_count: testword,
	   	nouns: nountest,
	   	adjectives: adjectivetest,
	   	verbs: verbtest,
	   	keys_found: tagtest	
	},
	matching:
	{
	    percentage_matching: pre  
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
