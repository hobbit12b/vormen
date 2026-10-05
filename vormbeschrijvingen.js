(function(root){
const descriptions={
cirkel:["Deze vorm is helemaal rond. Het is een …","Een cirkel: helemaal rond, zonder hoeken."],
vierkant:["Deze vorm heeft 4 kanten die even lang zijn. Het is een …","Een vierkant: vier gelijke kanten en vier rechte hoeken."],
driehoek:["Deze vorm heeft 3 hoeken. Het is een …","Een driehoek: drie kanten, drie hoeken."],
rechthoek:["Deze vorm heeft 2 lange kanten en 2 korte kanten. Het is een …","Een rechthoek: twee lange en twee korte kanten."],
ovaal:["Deze vorm is rond en langwerpig. Het is een …","Een ovaal: langwerpig rond, zonder hoeken."],
ruit:["Deze vorm heeft 4 kanten die even lang zijn en lijkt op een vlieger. Het is een …","Een ruit: vier gelijke kanten, twee smalle hoeken."],
zeshoek:["Deze vorm heeft 6 hoeken. Het is een …","Een zeshoek: zes kanten, zes hoeken."],
kubus:["Zes vierkante vlakken, zoals een dobbelsteen.","Een kubus: zes vierkante vlakken, zoals een dobbelsteen."],
bol:["Rond als een bal.","Een bol: rond als een bal."],
balk:["Een lange doos met platte vlakken.","Een balk: een lange doos met platte vlakken."],
piramide:["Driehoekige zijkanten, bovenaan één punt.","Een piramide: driehoekige zijkanten, bovenaan één punt."],
cilinder:["Twee platte cirkels, zoals een blikje.","Een cilinder: twee platte cirkels, zoals een blikje."]
};
const api={descriptions,clue:s=>descriptions[s][0],praise:s=>descriptions[s][1]};
if(typeof module!=='undefined')module.exports=api;else root.ShapeLanguage=api;
})(globalThis);
