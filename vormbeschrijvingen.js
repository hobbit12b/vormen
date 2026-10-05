(function(root){
const descriptions={
cirkel:["Helemaal rond, zonder hoeken.","Een cirkel: helemaal rond, zonder hoeken."],
vierkant:["Vier gelijke kanten en vier rechte hoeken.","Een vierkant: vier gelijke kanten en vier rechte hoeken."],
driehoek:["Drie kanten, drie hoeken.","Een driehoek: drie kanten, drie hoeken."],
rechthoek:["Twee lange en twee korte kanten.","Een rechthoek: twee lange en twee korte kanten."],
ovaal:["Langwerpig rond, zonder hoeken.","Een ovaal: langwerpig rond, zonder hoeken."],
ruit:["Vier gelijke kanten, twee smalle hoeken.","Een ruit: vier gelijke kanten, twee smalle hoeken."],
zeshoek:["Zes kanten, zes hoeken.","Een zeshoek: zes kanten, zes hoeken."],
kubus:["Zes vierkante vlakken, zoals een dobbelsteen.","Een kubus: zes vierkante vlakken, zoals een dobbelsteen."],
bol:["Rond als een bal.","Een bol: rond als een bal."],
balk:["Een lange doos met platte vlakken.","Een balk: een lange doos met platte vlakken."],
piramide:["Driehoekige zijkanten, bovenaan één punt.","Een piramide: driehoekige zijkanten, bovenaan één punt."],
cilinder:["Twee platte cirkels, zoals een blikje.","Een cilinder: twee platte cirkels, zoals een blikje."]
};
const api={descriptions,clue:s=>descriptions[s][0],praise:s=>'Goed zo! '+descriptions[s][1]};
if(typeof module!=='undefined')module.exports=api;else root.ShapeLanguage=api;
})(globalThis);
