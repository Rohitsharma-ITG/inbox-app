    import mongoose from "mongoose";

    const collectionSchema = new mongoose.Schema(
    {
        collectionId: {type: String,required: true,unique: true},
        title: {type: String,required: true},
        image: { type: String },
    },
    { timestamps: true }
    );

    const Collection = mongoose.model("Collection", collectionSchema);

    export default Collection;
