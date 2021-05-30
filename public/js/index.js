const closeBtn = document.querySelector('.closeBtn').addEventListener('click', function(){
    document.querySelector('.alert').style.display = 'none';
})

setTimeout(() => {
    document.querySelector('.alert').style.display = 'none';
},3000)