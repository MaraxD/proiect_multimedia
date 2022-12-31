var shape="line" //the default shape for drawing

//in cazul in care utilizatorul vrea sa deseneze altcv decat o linie
var shapes=document.getElementsByClassName("shape")
for(let i=0;i<shapes.length;i++){
    shapes[i].addEventListener('click',function(){
        shape=shapes[i].id
    })
    
}


//adaugare eventListener atunci cand user ul schimba culoarea
//2 events: input, pentru cand user ul schimba culoarea
        // change, cand user ul se razgandeste    
//cand desenezi mai multe forme, se stocheaza intr un array de acele forme

var color=document.getElementById("color"), newColor='black', fillColor='white' //initial e setat pe negru

color.addEventListener('input',function(){
    newColor=color.value
    fillColor=color.value
})

//getting the values from dropdown
var dropdown=document.getElementById("thicc"), newThicc=3
dropdown.addEventListener('input',function(){
    newThicc=dropdown.value
})

//an array of shapes that have been drawn
var drawnS=[], k=0

//for the undo button, we will start with the last element in the array and the delete it 
//but we have to make a copy after the initial array if we want the redo button to work
//both buttons should disappear only when there is at least one shape drawn

var btnUndo=document.getElementById("undo") 
btnUndo.addEventListener('click',function(){ 
    drawnS.push(svg.lastElementChild)      
    svg.removeChild(svg.lastElementChild)

})

//redo button, i ve put the last child of svg to the beginning of drawS
//so the last one deleted should be the first one pushed out
//the button should disappear when the last item was restored 
btnRedo=document.getElementById("redo")
btnRedo.addEventListener('click',function(){
    svg.appendChild(drawnS[drawnS.length-1])
    if(drawnS.length!=0){
        drawnS.length--
    }
})

//download the drawing
const getCSS=()=>{
    const sheet=document.styleSheets[0]
    const styleRules=[]
    for(let i=0;i<sheet.cssRules.length;i++){
        styleRules.push(sheet.cssRules.item(i).cssText)
    }

    const style=document.createElement('style')
    style.type='text/css'
    style.appendChild(document.createTextNode(styleRules.join(' ')))

    return style
}

const style=getCSS()

let btnSave=document.getElementById('save')
btnSave.addEventListener('click',function(){
    const svg2=document.querySelector('svg')
    svg2.insertBefore(style,svg.firstChild)
    const data=(new XMLSerializer()).serializeToString(svg2)
    const svgBlob=new Blob([data],{
        type:"image/svg+xml;charset=utf-8"
    })
    style.remove()

    const url=URL.createObjectURL(svgBlob)
    const img=new Image()
    img.addEventListener('load',function(){
        const bbox=svg2.getBBox()
        const canvas=document.createElement('canvas')
        //nu ia toata inaltimea?
        canvas.width=bbox.width
        canvas.height=bbox.height

        const context=canvas.getContext('2d')
        context.drawImage(img,0,0,canvas.width,canvas.height)

        URL.revokeObjectURL(url)

        const a =document.createElement('a')
        a.download='image.png'
        document.body.appendChild(a)
        a.href=canvas.toDataURL()
        a.click()
        a.remove()
    })
    img.src=url
})


//drawings remaining on page upon reload
// function populateStorage(){
//     if(drawnS.length){
//         for(let i=0;i<drawnS.length;i++){
//             localStorage.setItem("item"+i,drawnS[i])
//         }

//     }
// }

window.addEventListener('load',(event)=>{
    // const items=localStorage.getItem('line')
    // if(items.length){
    //    for(let i=0;i<items.length;i++){
    //     svg.appendChild(items[i])
    // } 
    // }
    
})



const svg=document.querySelector("#editor") //de ce nu se poate cu getElementById
const svgPoint=(svg,x,y)=>{
    const p=new DOMPoint(x,y)
    p.x=x
    p.y=y
    return p.matrixTransform(svg.getScreenCTM().inverse())
}

let drawnLines=[]
svg.addEventListener('mousedown',(e)=>{
    let shapeS=document.createElementNS ("http://www.w3.org/2000/svg", shape)
    let start= svgPoint(svg,e.clientX,e.clientY)
    switch (shape) {
        case "line":
            const drawLine=(event)=>{
                const p=svgPoint(svg,event.clientX,event.clientY)

                shapeS.setAttribute('class','drawing')
                shapeS.setAttribute('style','stroke:'+newColor+";stroke-width:"+newThicc)
                shapeS.setAttribute('x1',start.x)
                shapeS.setAttribute('y1',start.y)
                shapeS.setAttribute('x2',p.x)
                shapeS.setAttribute('y2',p.y)
                svg.appendChild(shapeS)

                //editing
                shapeS.addEventListener('click',(e)=>{
                    let btnDelete=document.getElementById("delete"),
                        btnEdit=document.getElementById('edit')

                    btnDelete.addEventListener('click',function(){
                        //se creeaza butonul de delete
                        svg.removeChild(e.target)
                    })

                    btnEdit.addEventListener('click',function(){
                        console.log(e.target)
                        console.log("da")
                    })

                    // console.log(e.target)
                    e.target.style.stroke=fillColor
                    e.target.style.strokewidth=newThicc
                    newColor="black"
                })
                
                
                
                
                
            }
            
            const endDrawLine=(e)=>{
                svg.removeEventListener('mousemove',drawLine)
                svg.removeEventListener('mouseup',endDrawLine)
    
            }
    
            svg.addEventListener('mousemove',drawLine)
            svg.addEventListener('mouseup',endDrawLine)                
            drawnLines.push(shapeS)
            localStorage.setItem("line",drawnLines)

            

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

                shapeS.setAttribute('class','drawing')
                shapeS.setAttribute('style','stroke:'+newColor+";stroke-width:"+newThicc)
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
                
            //BUGGGGG: the second time you want to edit the shape you can t
                //editing
                shapeS.addEventListener('click',(e)=>{
                    if(!(document.getElementById('delete')&& document.getElementById('edit')&&document.getElementById('move'))){
                        btnDelete=document.createElement("button")
                        btnDelete.innerHTML="Delete"
                        btnDelete.id="delete"

                        btnEdit=document.createElement("button")
                        btnEdit.innerHTML="Edit"
                        btnEdit.id="edit"

                        btnMove=document.createElement("button")
                        btnMove.innerHTML="Move"
                        btnMove.id="move"

                        document.getElementById("btn-group").appendChild(btnMove)
                        document.getElementById("btn-group").append(btnEdit)
                        document.getElementById("btn-group").appendChild(btnDelete)

                        

                        //stergere
                        btnDelete.addEventListener('click',function(){
                            svg.removeChild(e.target)
                            //daca sa sterge trebuie sa dispara si butoanele
                            document.getElementById("btn-group").removeChild(btnDelete)
                            document.getElementById("btn-group").removeChild(btnEdit)

                        })

                        btnEdit.addEventListener('click',function(){
                            //only the selected shape can be edited
                            e.target.addEventListener('click',function(){
                                e.target.style.fill=fillColor
                                e.target.style.strokewidth=newThicc
                                newColor="black" //'reset' de color
                                document.getElementById("btn-group").removeChild(btnDelete)
                                document.getElementById("btn-group").removeChild(btnEdit)
                            })
                            
                        })

                        btnMove.addEventListener('click',function(){
                            svg.addEventListener('mousedown',startMove)
                            svg.addEventListener('mousemove',move)
                            svg.addEventListener('mouseup',endMove)
                            svg.addEventListener('mouseleave',endMove)

                            var selectedItem, offset

                            function getMousePosition(event){
                                var CTM=svg.getScreenCTM()
                                return{
                                    x:(event.clientX-CTM.e)/CTM.a,
                                    y:(event.clientY-CTM.f)/CTM.d

                                };
                            }

                            function startMove(event){
                                if(event.target){
                                    selectedItem=event.target
                                    offset=getMousePosition(event)
                                    offset.x-=parseFloat(selectedItem.getAttribute(null,'x'))
                                    offset.y-=parseFloat(selectedItem.getAttribute(null,'y'))

                                }
                            }

                            function move(event){
                                if(selectedItem){
                                    event.preventDefault()
                                    var coord=getMousePosition(event)
                                    selectedItem.setAttributeNS(null,'x',coord.x-offset.x)
                                    selectedItem.setAttributeNS(null,'y',coord.y-offset.y)

                                }
                            }

                            function endMove(){
                                selectedItem=null
                            }























                            // e.target.addEventListener('mouseover',(event)=>{
                            //     event.preventDefault()
                            //     console.log(e.target.getAttributeNS(null,'x'))
                            //     var newX=parseFloat(e.target.getAttributeNS(null,'x'))
                            //     e.target.setAttributeNS(null,'x',newX+0.1)
                            // })

                            // e.target.addEventListener('mouseup',function(){
                            //     e.target=null
                            // }) 
                        
                        })
                    }
                })

            

                
        

            break;

        case "circle":
            const drawCircle=(event)=>{
                const p=svgPoint(svg, event.clientX,event.clientY)
                const r=Math.abs(p.x-start.x)/2

                shapeS.setAttribute('class','drawing')
                shapeS.setAttribute('style','stroke:'+newColor+";stroke-width:"+newThicc)
                shapeS.setAttribute('cx',p.x)
                shapeS.setAttribute('cy',p.y)
                shapeS.setAttribute('r',r)
                svg.appendChild(shapeS)

                //editing
                shapeS.addEventListener('click',(e)=>{
                    let btnDelete=document.getElementById("delete")
                    btnDelete.addEventListener('click',function(){
                        svg.removeChild(e.target)
                    })
                    console.log(e.target)
                    e.target.style.fill=fillColor
                    e.target.style.strokewidth=newThicc
                    newColor="black"

                })


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

                shapeS.setAttribute('style','stroke:'+newColor+";stroke-width:"+newThicc)
                shapeS.setAttribute('cx',p.x)
                shapeS.setAttribute('cy',p.y)
                shapeS.setAttribute('rx',rx)
                shapeS.setAttribute('ry',ry)
                svg.appendChild(shapeS)

                //editing
                shapeS.addEventListener('click',(e)=>{
                    let btnDelete=document.getElementById("delete")
                    btnDelete.addEventListener('click',function(){
                        svg.removeChild(e.target)
                    })
                    console.log(e.target)
                    e.target.style.fill=fillColor
                    e.target.style.strokewidth=newThicc
                    newColor="black"

                })


            }

            const endDrawEllipse=(e)=>{
                svg.removeEventListener('mousemove',drawEllipse)
                svg.removeEventListener('mouseup',endDrawEllipse)

            }

            svg.addEventListener('mousemove',drawEllipse)
            svg.addEventListener('mouseup',endDrawEllipse)                
            drawnS.push(shapeS)

            break;
    }
    

})

