var shape="line" //the default shape for drawing

//in cazul in care utilizatorul vrea sa deseneze altcv decat o linie
var shapes=document.getElementsByClassName("shape")
for(let i=0;i<shapes.length;i++){
    shapes[i].addEventListener('click',function(){
        shape=shapes[i].id
    })
}

//crearea unui elem svg
//document.createElementNS ("http://www.w3.org/2000/svg", TAG_SVG")

const svg=document.querySelector("#editor") //de ce nu se poate cu getElementById
const svgPoint=(elem,x,y)=>{
    const p=svg.createSVGPoint()
    p.x=x
    p.y=y
    return p.matrixTransform(elem.getScreenCTM().inverse())
}


svg.addEventListener('mousedown',(e)=>{
    //selected shape
    const shapeS=document.createElementNS ("http://www.w3.org/2000/svg", shape)
    const start=svgPoint(svg,e.clientX,e.clientY)
    const draw=(event)=>{
        const p=svgPoint(svg, event.clientX,event.clientY)
        const w=Math.abs(p.x-start.x)
        const h=Math.abs(p.y-start.y)
        if(p.x>start.x){
            p.x=start.x
        }

        if(p.y>start.y){
            p.y=start.y
        }

        shapeS.setAttributeNS(null,'x',p.x)
        shapeS.setAttributeNS(null,'y',p.y)
        shapeS.setAttributeNS(null,'width',w)
        shapeS.setAttributeNS(null,'height',h)
        svg.appendChild(shapeS)

    }

    const endDraw=(e)=>{
        svg.removeEventListener('mousemove',draw)
        svg.removeEventListener('mouseup',endDraw)

    }

    svg.addEventListener('mousemove',draw)
    svg.addEventListener('mouseup',endDraw)

})

