var shape="line" //the default shape for drawing

//in case the user want to draw anything other than a line
var shapes=document.getElementsByClassName("shape")
for(let i=0;i<shapes.length;i++){
    shapes[i].addEventListener('click',function(){
        shape=shapes[i].id
    })
    
}

const svg=document.querySelector("#editor") 

var color=document.getElementById("color"), newColor='black', fillColor='black' //initial color of the shape
//adding eventListener when the user changes the color 
color.addEventListener('input',function(){
    newColor=color.value
    fillColor=color.value
})

//getting the values from dropdown
var dropdown=document.getElementById("thicc"), newThicc=3
dropdown.addEventListener('input',function(){
    newThicc=dropdown.value
})

//an array of shapes that have been drawn (useful for the undo and redo operations)
var drawnS=[]

//for the undo button, we will start with the last element in the array and the delete it 
//but we have to make a copy after the initial array if we want the redo button to work
//both buttons should disappear only when there is at least one shape drawn
let btnUndo=document.getElementById('undo'),
    btnRedo=document.getElementById("redo")
svg.addEventListener('mousedown',function(){
    //the btn should appear at the first instance of a shape
        if(svg.childElementCount>0){
            if(btnUndo.getAttribute('hidden')){
            //if it is hidden
            btnUndo.removeAttribute('hidden')
            }
        }
})
    
    
btnUndo.addEventListener('click',function(){ 
        drawnS.push(svg.lastElementChild)      
        svg.removeChild(svg.lastElementChild)
        if(svg.childElementCount===0){
            btnUndo.setAttribute('hidden','hidden')
            btnRedo.removeAttribute('hidden')
        }
    })


// redo button, i ve put the last child of svg to the beginning of drawnS
// so the last one deleted should be the first one pushed out
// the button should disappear when the last item was restored 
btnRedo.addEventListener('click',function(){
    if(drawnS.length>1){    
        svg.appendChild(drawnS[drawnS.length-1])
        console.log(drawnS.length)
    }else{
        //when the user redoes the last element
        svg.appendChild(drawnS[drawnS.length-1])
        btnRedo.setAttribute('hidden','hidden')
    }        
    drawnS.length--

})

//failed attempt at moving a shape
// function moveShape(){
//     svg.addEventListener('mousedown',startMove)
//     svg.addEventListener('mousemove',move)
//     svg.addEventListener('mouseup',endMove)
//     svg.addEventListener('mouseleave',endMove)
//     var selectedShape=null

//     function startMove(e){
//         selectedShape=e.target        
//     }

//     function move(e){
//         if(selectedShape){
//             selectedShape.preventDefault()
//             var x=parseFloat(selectedShape.getAttributeNS(null,'x'))
//             selectedShape.setAttributeNS(null,'x',x+0.1)
//         }
//     }

//     function endMove(e){
//         selectedShape=null
//     }
// }


const getCSS=()=>{
    const sheet=document.styleSheets[0]
    const styleRules=[]
    //pushing the styles associated to the shapes into an array
    for(let i=0;i<sheet.cssRules.length;i++){
        styleRules.push(sheet.cssRules.item(i).cssText)
    }

    const style=document.createElement('style')
    style.type='text/css'
    style.appendChild(document.createTextNode(styleRules.join(' ')))

    return style
}

const style=getCSS()


//download the drawing as png
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
        //getting the coordinates of the svg for drawing (x,y, height, width)
        const bbox=svg2.getBBox()
        const canvas=document.createElement('canvas')
        canvas.width=1000
        canvas.height=400

       
        const context=canvas.getContext('2d')
        context.drawImage(img,0,0,bbox.width,bbox.height)

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

//download as SVG file
let btnSVG=document.getElementById('saveSVG')
btnSVG.addEventListener('click',function(){
    const svg2=document.querySelector('svg')
    svg2.insertBefore(style,svg.firstChild)
    const data=(new XMLSerializer()).serializeToString(svg2) //the xml that should be put in the url
   
    const svgBlob=new Blob([data],{
        type:"image/svg+xml;charset=utf-8"
    }) 
    style.remove()

    const url=URL.createObjectURL(svgBlob)
    console.log(url)
    const img=new Image()
    img.addEventListener('load',function(){
        //getting the coordinates of the svg for drawing (x,y, height, width)
        const bbox=svg2.getBBox()
        const canvas=document.createElement('canvas')
        canvas.width=1000
        canvas.height=400
        canvas.innerHTML=data

       
        const context=canvas.getContext('2d')
        context.drawImage(img,0,0,bbox.width,bbox.height)

    
        URL.revokeObjectURL(url)

        const a =document.createElement('a')
        a.download='imageSVG.svg'
        
        console.log(a)
        document.body.appendChild(a)
        // a.setAttribute('xlink:href',canvas.toDataURL())
        a.href=canvas.toDataURL()

        a.click()
        a.remove()
    })
    img.src=url
})


//drawings remaining on page upon reload
function populateStorage(i,shape){
    localStorage.setItem(`item ${i}`,shape)
}

function setDrawings(){
    for(let i=0;i<localStorage.length;i++){
        svg.appendChild(localStorage.getItem(localStorage.key(`item ${i}`)))
    }
}

let k
window.addEventListener('load',()=>{
    // localStorage.clear()
    if(localStorage.length!=0){
        setDrawings()
    }else{
        k=0
    }
})

//editing tools for when the user clicks on a drawn shape
function editing(shape){
    shape.addEventListener('click',(e)=>{
        if(!(document.getElementById('edit'))){

            let divEdit=document.createElement("div")
            divEdit.id="edit"
            document.getElementById("tools").appendChild(divEdit)

            let h4Elem=document.createElement("h4")
            h4Elem.innerHTML="Tools"
            document.getElementById("edit").appendChild(h4Elem)

            let btnDelete=document.createElement("button")
            btnDelete.innerHTML="Delete"
            btnDelete.id="delete"

            let btnEdit=document.createElement("button")
            btnEdit.innerHTML="Color it"
            btnEdit.id="fill"

            let btnStroke=document.createElement("button")
            btnStroke.innerHTML="Change stroke"
            btnStroke.id="stroke"

            let btnMove=document.createElement("button")
            btnMove.innerHTML="Move"
            btnMove.id="move"

            let btnCancel=document.createElement("button")
            btnCancel.innerHTML="Cancel"
            btnCancel.id="cancel"

            
            document.getElementById("edit").appendChild(btnMove)
            document.getElementById("edit").appendChild(btnEdit)
            document.getElementById("edit").appendChild(btnStroke)
            document.getElementById("edit").appendChild(btnDelete)
            document.getElementById("edit").appendChild(btnCancel)

            //delete
            btnDelete.addEventListener('click',function(){
                svg.removeChild(e.target)
                //if the shape is deleted, all the buttons should be removed
                document.getElementById("tools").removeChild(divEdit)
            })

            //fill in: does not work the second time you press on the shape
            btnEdit.addEventListener('click',function(){
                    //only the selected shape can be edited
                    e.target.addEventListener('click',function(){
                        if(e.target.tagName==='line'){
                            e.target.style.stroke=fillColor
                        }else{
                            e.target.style.fill=fillColor
                        }
                        newColor="black" //'reset' de color
                        document.getElementById("tools").removeChild(divEdit)


                    })
                
            })

            //change stroke width
            btnStroke.addEventListener('click',function(){
                e.target.setAttribute('style',`stroke-width:${newThicc}`)
                newThicc=3 //'reset' the width
                document.getElementById("tools").removeChild(divEdit)


            })

            //if the user changes its mind
            btnCancel.addEventListener('click',function(){
                document.getElementById("tools").removeChild(divEdit)
            })
            
        }
    })
}

const svgPoint=(svg,x,y)=>{
    const p=new DOMPoint(x,y)
    p.x=x
    p.y=y
    return p.matrixTransform(svg.getScreenCTM().inverse())
}

let drawnLines=[]
svg.addEventListener('mousedown',(e)=>{
    let shapeS=document.createElementNS("http://www.w3.org/2000/svg", shape)
    let start= svgPoint(svg,e.clientX,e.clientY)
    switch (shape) {
        case "line":
            const drawLine=(event)=>{
                let p=svgPoint(svg,event.clientX,event.clientY)
                

                shapeS.setAttribute('class','drawing')
                shapeS.setAttribute('style','stroke:'+newColor+";stroke-width:"+newThicc)
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
            editing(shapeS)

            

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
                
                //editing
                editing(shapeS)
   
            break;

        case "circle":
            const drawCircle=(event)=>{
                const p=svgPoint(svg, event.clientX,event.clientY)
                const rx=Math.abs(p.x-start.x)/2, 
                    ry=Math.abs(p.y-start.y)/2

                shapeS.setAttribute('class','drawing')
                shapeS.setAttribute('style','stroke:'+newColor+";stroke-width:"+newThicc)
                shapeS.setAttribute('cx',p.x)
                shapeS.setAttribute('cy',p.y)
                shapeS.setAttribute('r',Math.max(rx,ry))
                svg.appendChild(shapeS)


            }

            const endDrawCircle=(e)=>{
                svg.removeEventListener('mousemove',drawCircle)
                svg.removeEventListener('mouseup',endDrawCircle)

            }

            svg.addEventListener('mousemove',drawCircle)
            svg.addEventListener('mouseup',endDrawCircle)     
            
            editing(shapeS)


            break;


        case "ellipse":
            const drawEllipse=(event)=>{
                const p=svgPoint(svg, event.clientX,event.clientY),
                    rx=Math.abs(p.x-start.x)/2,
                    ry=Math.abs(p.y-start.y)/2,
                    cx=(p.x+start.x)/2,
                    cy=(p.y+start.y)/2



                shapeS.setAttribute('style','stroke:'+newColor+";stroke-width:"+newThicc)
                shapeS.setAttribute('cx',cx)
                shapeS.setAttribute('cy',cy)
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
           
            editing(shapeS)


            break;
    }
    

})

