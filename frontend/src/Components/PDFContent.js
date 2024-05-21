import jsPDF from 'jspdf';


const PDFContent = ({arr,obj}) => {
    var arr2=[];

    {
    for(let i=0;i<arr.length;i++){
        if(!obj[arr[i]][0]) continue;
        var coun=obj[arr[i]][0].voteCount;
        var temp2=[];
        temp2.push(obj[arr[i]][0].name);

        for(let j=1;j<arr[i].length;j++){
            if(!obj[arr[i]][j]) continue;

            if(obj[arr[i]][j].voteCount===coun){
                temp2.push(obj[arr[i]][j].name);
            }
            else if(obj[arr[i]][j].voteCount>coun){
                temp2.clear()
                temp2.push(obj[arr[i]][j].name);
            }
        }

        var tempObj=[];
        tempObj=[arr[i],temp2];
        arr2.push(tempObj);
    }
}

    const pdf = new jsPDF();

    pdf.setProperties({
        title: "Winners"
    })

    pdf.text('Winners',65,10);

    for(let i=0;i<arr2.length;i++){
        pdf.text(`${arr2[i][0]}'s post's winner is/are ${arr2[i][1]}`,55,40+i*10);
    }

    pdf.save(`ElectionResults.pdf`);

}

export default PDFContent
