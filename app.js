document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 5;
    let platforms = []; let score =0;
    let upTimerId;  let isGoingLeft = false; let isGoingRight = false;
    let downTimerID; let isJumping = true; let leftTimerId; let rightTimerId;
    
    function createDoodler(){
        grid.appendChild(doodler)
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
    }
    
    class Platform{
        constructor(newPlatBottom){
            this.bottom= newPlatBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div')
            
            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left+ 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }
    
    function createPlatforms(){
        for (let i= 0; i<platformCount; i++){
            let platGap = 600 / platformCount;
            let newPlatBottom = 100 + i * platGap
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)
            console.log(newPlatform)
        }
        
    }
    
    function movePlatforms(){
        if (doodlerBottomSpace>200){
            platforms.forEach(platform => {
                platform.bottom -=4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';
                
                if (platform.bottom < 10){
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform') //remove platforms that have passed
                    platforms.shift()
                    score++;        //Count score
                    console.log(platforms)
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
        
    }
    
    function jump(){
        clearInterval(downTimerID);
        isJumping = true;
        upTimerId = setInterval(function (){
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace> startPoint + 200){
                fall();
            }
        },30)
        
    }
    
    function fall(){
        clearInterval(upTimerId);
        isJumping = false;
        downTimerID = setInterval(function () {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace <= 0){
                gameOver();
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) && (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= platform.left) && (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ){
                    console.log("Landed");
                    startPoint = doodlerBottomSpace;
                    jump();
                }
            })
            
        },30)
        
    }
    
    function gameOver(){
        console.log("Game over");
        isGameOver = true;
        while (grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score;
        clearInterval(upTimerId);
        clearInterval(downTimerID);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        
        
    }
    
    function control(e){
        if (e.key === "ArrowLeft"){
            moveLeft();
        } else if ( e.key === "ArrowRight"){
            moveRight();
        }else if(e.key === "ArrowUp"){
            moveStraight();
            
        }
        
    }
    
    function moveLeft(){
        if ( isGoingRight){
            clearInterval(rightTimerId);
            isGoingRight = false;
            
        }
        isGoingLeft = true;
        leftTimerId = setInterval(function (){
            if (doodlerLeftSpace > 0){
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            } else moveRight();
        },20)
        
    }
    
    function moveRight(){
        if (isGoingLeft){
            clearInterval(leftTimerId);
            isGoingLeft = false;
            
        }
        isGoingRight = true;
        rightTimerId = setInterval(function (){
            if(doodlerLeftSpace <= 340){
                doodlerLeftSpace += 5;
                doodler.style.left = doodlerLeftSpace + 'px';
                
            } else moveLeft();
            
        },20)
        
    }
    
    function moveStraight(){
        isGoingRight = false; clearInterval(rightTimerId);
        isGoingLeft = false; clearInterval(leftTimerId);
        
    }
    
    function start(){
        if (!isGameOver){
            createPlatforms();
            createDoodler();    
            setInterval(movePlatforms,30);
            jump();
            document.addEventListener('keyup', control)
            
        }
            
    }
    //attach to a Button
    start()
    
    
})