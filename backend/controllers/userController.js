const User = require('../models/user.js');
const Candidate=require('../models/candidate.js');
const generateToken = require('../config/generateToken');

const registerUser = async (req, res) => {
    const { name,age,email, password,aadharNum,mobile,address,role } = req.body;
    if (!name || !email || !password||!age||!aadharNum||!mobile||!address|| !role) {
        res.status(400).json({error: 'Please enter all required fields'});
    }


    const userExists = await User.findOne({ aadharNum });

    if (userExists) {
        res.status(400).json({error: 'User already exists'});
    }
    else if(age<25&&role==='member'){
        res.send({message: 'You should me atleast 25 years old to be member'});
    }
    else{
        const user = await User.create({
            name: name,
            age,
            email,
            password,
            aadharNum,
            mobile,
            address,
            role
        });
    
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                aadharNum: user.aadharNum,
                mobile: user.mobile,
                address: user.address,
                age: user.age,
                hasProposed: user.hasProposed,
                hasSecondered: user.hasSecondered,
                token: generateToken(user._id),
                hasVoted: user.hasVoted
            });
        } else {
            res.status(400).json({error:'Failed to create user'});
        }
    }
};

const authUser = async (req, res) => {
    const { password,aadharNum } = req.body;

    if(!password||!aadharNum){
        res.status(400).json({error: 'Please enter all required fields'});
    }

    const user = await User.findOne({ aadharNum });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                aadharNum: user.aadharNum,
                mobile: user.mobile,
                address: user.address,
                age: user.age,
                hasProposed: user.hasProposed,
                hasSecondered: user.hasSecondered,
            token: generateToken(user._id),
            hasVoted: user.hasVoted
        })
    }
    else {
        res.status(401).json({error:'Invalid User'})
    }
};

const vote= async (req,res) =>{
    const {aadharNum}=req.body;
    const aadharUser=req.user.aadharNum;
    const role=req.user.role;

    let post="";
    const candidateExists= await Candidate.findOne({aadharNum});

    if(candidateExists) post=candidateExists.post;

    if(!candidateExists){
        res.status(400).json({error: 'Candidate does not exits'});
    }
    else if(candidateExists.isSecondered===false){
        res.status(400).json({error: 'Candidate is not proposed or secondered'});
    }
    else if(role=='member') res.status(400).json({error: 'Members cannot vote'});
    else if(req.user.hasVoted.includes(post)) res.status(400).json({error: `You have already voted for ${post}`});
    else{
        const updatedCandidate=await Candidate.findOneAndUpdate(
            {aadharNum},
            {voteCount: candidateExists.voteCount+1},
            {new:true}
          )

          const updatedUser=await User.findOneAndUpdate(
            {aadharNum: aadharUser},
            { $push: { hasVoted: post } },
            {new:true}
          )

        res.status(200).json([updatedCandidate,updatedUser]);
    }
}

const getCandidates=async (req,res)=>{
    const allCandidates=await Candidate.find();

    res.status(200).json(allCandidates);
}

module.exports={registerUser,authUser,vote,getCandidates};
