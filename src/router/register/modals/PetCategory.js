const petCategory = ["dog", "cat", "hamster", "duck", "hedgehog"];

const PetCategoryModal = ({getModalActive, getPetCategory}) => {
   
    // 카테고리를 선택하면 부모노드에게 값을 보내고 modal 창 닫음
    const sendParent = (event) => {
        getPetCategory(event.target.getAttribute("data-key"));
        getModalActive(false);
    }
    return(
        <div style={{display: "flex",position: "fixed", top: "30%", left: "40%"}}>
            {petCategory.map((pet, index) => (
                <div key={index} data-key={pet} style={{width: "100px", aspectRatio: "1/1", border:"1px solid red", borderRadius:"100px"}} onClick={sendParent}>
                    {pet}
                </div>
                
                
            ))}
        </div>
    );
}

export default PetCategoryModal;