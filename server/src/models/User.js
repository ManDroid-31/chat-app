import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar_url: { type: String, required: true },
    bio: { type: String, required: false, default: "" },
    fcm_token: { type: String, required: false, default: "" },
    }, 
    { timestamps: true });

export default mongoose.model('User', userSchema);


/*
avatar urls

https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light

https://avataaars.io/?avatarStyle=Circle&topType=WinterHat1&accessoriesType=Blank&hatColor=Red&hairColor=Blue&facialHairType=Blank&clotheType=ShirtCrewNeck&clotheColor=Gray01&eyeType=Surprised&eyebrowType=UpDownNatural&mouthType=Tongue&skinColor=Light

https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurvy&accessoriesType=Prescription01&hatColor=Pink&hairColor=Black&facialHairType=BeardMajestic&facialHairColor=BrownDark&clotheType=Overall&clotheColor=Gray02&eyeType=Squint&eyebrowType=Angry&mouthType=Sad&skinColor=Tanned

https://avataaars.io/?avatarStyle=Circle&topType=Turban&accessoriesType=Sunglasses&hatColor=PastelBlue&hairColor=Red&facialHairType=BeardLight&facialHairColor=Auburn&clotheType=Hoodie&clotheColor=PastelBlue&eyeType=Default&eyebrowType=UpDownNatural&mouthType=Twinkle&skinColor=Light

https://avataaars.io/?avatarStyle=Circle&topType=WinterHat2&accessoriesType=Round&hatColor=Gray02&hairColor=Platinum&facialHairType=BeardMajestic&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Heather&graphicType=Skull&eyeType=WinkWacky&eyebrowType=SadConcerned&mouthType=Twinkle&skinColor=DarkBrown

https://avataaars.io/?avatarStyle=Circle&topType=Hat&accessoriesType=Prescription02&hairColor=Red&facialHairType=BeardMajestic&facialHairColor=Red&clotheType=ShirtVNeck&clotheColor=PastelOrange&eyeType=Surprised&eyebrowType=UnibrowNatural&mouthType=Grimace&skinColor=Pale

*/