Editor SVG 
Descriere: Construirea unui editor pentru grafică vectorială folosind elementul SVG. 
Exemplu: Google Drawings

1p - suport pentru adăugare elemente geometrice de bază (linie, elipsă, dreptunghi) --DONE, mai putin elipsa <br/>
0.5p - suport pentru selectarea culorii și grosimii liniei pentru adăugare --DONE <br/>
2p - suport pentru selecție și ștergere / modificare elemente existente (proprietăți: culoare și grosime linie, culoare fundal) <br/>
1p - suport pentru anularea ultimelor n operații (undo) --DONE+redo <br/>
1.5p - suport pentru mutare elemente utilizând mouse-ul <br/>
2p - suport pentru desenare căi cu editarea ulterioară a punctelor <br/>
1p - funcționalitate de export în format raster (*.png sau *.jpeg) <br/>
0.5p - posibilitate salvare desen în format SVG <br/>
1p - salvarea automată a desenului curent și reîncărcare la pornire cu ajutorul Web Storage API (sau a unui alt API similar) <br/>

notite pentru implementare: <br/>
->clasa Shape, din care deriva Circle, Rectangle, whatev <br/>
->din interfata utilizatorul alege ce forma vrea sa deseneze (gandeste te cum e la paint 3D; not free shape)
