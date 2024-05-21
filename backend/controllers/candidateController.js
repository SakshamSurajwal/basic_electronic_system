const Candidate = require("../models/candidate");
const User = require("../models/user");


const nominateUser = async (req, res) => {
    const { post,aadharNum } = req.body;
    if (!post||!aadharNum) {
        res.status(400).json({error: 'Please enter all required fields'});
    }

    const userDet=await User.findOne({aadharNum});
    const candidateExists = await Candidate.findOne({ aadharNum });

    if (candidateExists) {
        res.status(400).json({error: 'Candidate already exists'});
    }
    else{
    const candidate = await Candidate.create({
        name: userDet.name,
        age: userDet.age,
        post,
        aadharNum: userDet.aadharNum
    });
    
    if (candidate) {
        res.status(201).json({
            _id: candidate._id,
            name: candidate.name,
            age: candidate.age
        });
    } else {
        res.status(400).json({error:'Failed to nominate'});
    }
    }
};

const proposeUser= async (req,res)=>{
    const {aadharNum}=req.body;
    const aadharUser=req.user.aadharNum;

    const candidateExists = await Candidate.findOne({ aadharNum });

    if(req.user.role==='voter') res.status(400).json({error: 'Only members can propose candidate'});
    else if(!aadharNum) res.status(400).json({error: 'Please enter aadhar number of the candidate'});
    else if(candidateExists){
        if(req.user.hasSecondered===true||req.user.hasProposed===true){
            res.status(400).json({error: 'You can not propose because you have already proposed or secondered one of the candidate'});
        }
        else{
        const updatedCandidate=await Candidate.findOneAndUpdate(
            {aadharNum},
            {isProposed: true},
            {new:true}
          )

          const updatedUser=await User.findOneAndUpdate(
            {aadharNum: aadharUser},
            {hasProposed: true},
            {new:true}
          )
        }

        res.status(200);          
    }
    else res.status(401).json({error: 'No candidate exits'});
}

const seconderUser= async (req,res)=>{
    const {aadharNum}=req.body;
    const aadharUser=req.user.aadharNum;

    const candidateExists = await Candidate.findOne({ aadharNum });

    if(req.user.role==='voter') res.status(400).json({error: 'Only members can seconder candidate'});
    else if(!aadharNum) res.status(400).json({error: 'Please enter aadhar number of the candidate'});
    else if(candidateExists){

        if(req.user.hasProposed===true) res.status(400).json({error: 'You can not seconder because you proposed one of the candidate'});
        if(req.user.hasSecondered===true||req.user.hasProposed===true){
            res.status(400).json({error: 'You can not propose because you have already proposed or secondered one of the candidate'});
        }
        else{
        const updatedCandidate=await Candidate.findOneAndUpdate(
            {aadharNum},
            {isSecondered: true},
            {new:true}
          )

          const updatedUser=await User.findOneAndUpdate(
            {aadharNum: aadharUser},
            {hasSecondered: true},
            {new:true}
          )

        res.status(200).json([updatedCandidate,updatedUser]);      
        }    
    }
    else res.status(401).json({error: 'No candidate exits'});
}

const withdrawl=async (req,res)=>{
    const {aadharNum}=req.body;

    const candidateExists=await Candidate.findOne({aadharNum});

    if(!candidateExists) res.status(400).json({error:'You can not withdrawl because you were never nominated'});
    else{
        await Candidate.deleteOne({aadharNum});
        res.status(200).json({message: 'Succesfully withdrawled your nomination'});
    }
}

module.exports={nominateUser,proposeUser,seconderUser,withdrawl}; 