import { styled, keyframes } from 'styled-components';
import dog from '../../../image/icon/puppy_icon.png';
import cat from '../../../image/icon/cat_icon.png';
import hamster from '../../../image/icon/hamster_icon.png';
import duck from '../../../image/icon/duck_icon.png';
import hedgedog from '../../../image/icon/hedgehog_icon.png';


const fadeIn = keyframes`
    0% {
    opacity: 0;
    }
    100% {
    opacity: 1;
    }
`;

const Container = styled.div`
    display: flex;
    position: absolute;
    top: 10px;
    left: 20px;
    width: 740px;
    height: 300px;
    padding: 20px;
    box-shadow: 2px 3px 5px 0px;
    background-color: white;
    animation: ${fadeIn} 2s;
`;

const CategoryList = styled.ul`
    display: flex;
    justify-content: center;
    align-items: center;
`

const Category = styled.li`
    margin: 10px;
    width: 120px;
    aspect-ratio: 1/1;
`

const CategoryImage = styled.img`
    width: 100px;
    height: 100px;
    border: 5px solid black;
    border-radius: 100px;
`


const petCategory = ["dog", "cat", "hamster", "duck", "hedgehog"];
const petIcon = [dog, cat, hamster, duck, hedgedog];

const PetCategoryModal = ({getModalActive, getPetCategory}) => {
   
    // 카테고리를 선택하면 부모노드에게 값을 보내고 modal 창 닫음
    const sendParent = (event) => {
        getPetCategory(event.target.dataset.mypet);
        getModalActive(false);
    }

    return(
        <Container>
            <CategoryList>
                {petCategory.map((pet, index) => (
                    <Category key={index} >
                        <CategoryImage src={petIcon[index]} data-mypet={pet} onClick={sendParent}/><br/>
                        <span>{pet}</span>
                    </Category>
                ))}
            </CategoryList>
        </Container>
    );
}

export default PetCategoryModal;