var shape="line" //the default shape for drawing

//in cazul in care utilizatorul vrea sa deseneze altcv decat o linie
var shapes=document.getElementsByClassName("shape")
for(let i=0;i<shapes.length;i++){
    shapes[i].addEventListener('click',function(){
        shape=shapes[i].id
    })
    
}


const svg=document.querySelector("#editor") //de ce nu se poate cu getElementById
const svgPoint=(svg,x,y)=>{
    const p=new DOMPoint(x,y)
    p.x=x
    p.y=y
    return p.matrixTransform(svg.getScreenCTM().inverse())
}

//adaugare eventListener atunci cand user ul schimba culoarea
//2 events: input, pentru cand user ul schimba culoarea
        // change, cand user ul se razgandeste    
//cand desenezi mai multe forme, se stocheaza intr un array de acele forme

var color=document.getElementById("color"), newColor='black' //initial e setat pe negru

color.addEventListener('input',function(){
    newColor=color.value
})

//getting the values from dropdown
var dropdown=document.getElementById("thicc"), newThicc=3
dropdown.addEventListener('input',function(){
    newThicc=dropdown.value
})


svg.addEventListener('mousedown',(e)=>{
    let shapeS=document.createElementNS ("http://www.w3.org/2000/svg", shape)
    let start= svgPoint(svg,e.clientX,e.clientY)
    switch (shape) {
        case "line":
            const drawLine=(event)=>{
                const p=svgPoint(svg,event.clientX,event.clientY)

                shapeS.setAttribute('style','stroke:'+newColor)
                shapeS.setAttribute('style','stroke-width:'+newThicc)
                shapeS.setAttribute('x1',start.x)
                shapeS.setAttribute('y1',start.y)
                shapeS.setAttribute('x2',p.x)
                shapeS.setAttribute('y2',p.y)
                
                svg.appendChild(shapeS)

            }
            
            const endDrawLine=(e)=>{
                svg.removeEventListener('mousemove',drawLine)
                svg.removeEventListener('mouseup',endDrawLine)
    
            }
    
            svg.addEventListener('mousemove',drawLine)
            svg.addEventListener('mouseup',endDrawLine)
            break;

        case "rect":
            const drawRect=(event)=>{
                const p=svgPoint(svg, event.clientX,event.clientY)
                const w=Math.abs(p.x-start.x)
                const h=Math.abs(p.y-start.y)
                if(p.x>start.x){
                    p.x=start.x
                }

                if(p.y>start.y){
                    p.y=start.y
                }

                shapeS.setAttribute('style','stroke:'+newColor)
                shapeS.setAttribute('x',p.x)
                shapeS.setAttribute('y',p.y)
                shapeS.setAttribute('width',w)
                shapeS.setAttribute('height',h)
                svg.appendChild(shapeS)

            }

            const endDrawRect=(e)=>{
                svg.removeEventListener('mousemove',drawRect)
                svg.removeEventListener('mouseup',endDrawRect)

            }

            svg.addEventListener('mousemove',drawRect)
            svg.addEventListener('mouseup',endDrawRect)
            break;

        case "circle":
            const drawCircle=(event)=>{
                const p=svgPoint(svg, event.clientX,event.clientY)
                const r=Math.abs(p.x-start.x)/2

                shapeS.setAttribute('style','stroke:'+newColor)
                shapeS.setAttribute('cx',p.x)
                shapeS.setAttribute('cy',p.y)
                shapeS.setAttribute('r',r)
                svg.appendChild(shapeS)

            }

            const endDrawCircle=(e)=>{
                svg.removeEventListener('mousemove',drawCircle)
                svg.removeEventListener('mouseup',endDrawCircle)

            }

            svg.addEventListener('mousemove',drawCircle)
            svg.addEventListener('mouseup',endDrawCircle)
            break;


        case "elips":
            const drawEllipse=(event)=>{
                const p=svgPoint(svg, event.clientX,event.clientY)
                const rx=Math.abs(p.x-start.x)/2
                const ry=Math.abs(p.y-start.y)/2

                shapeS.setAttribute('style','stroke:'+newColor)
                shapeS.setAttribute('cx',p.x)
                shapeS.setAttribute('cy',p.y)
                shapeS.setAttribute('rx',rx)
                shapeS.setAttribute('ry',ry)
                svg.appendChild(shapeS)

            }

            const endDrawEllipse=(e)=>{
                svg.removeEventListener('mousemove',drawEllipse)
                svg.removeEventListener('mouseup',endDrawEllipse)

            }

            svg.addEventListener('mousemove',drawEllipse)
            svg.addEventListener('mouseup',endDrawEllipse)
            break;
    }
    

})

