// // 게시물작성
// // CKEditor 사용
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import session from "react-session-api";
// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from 'react-router-dom';
// import UploadAdapter from '../../utils/UploadAdaptor';
// import axios from 'axios';
// import KakaoMapWrite from '../../component/GeoAPI';

// const stateList = ["--분류--","나눔", "판매"];
// const categories = ["--카테고리--", "완구류", "침구류", "간식류", "주식", "음료", "기타"];
// const conditionList = ["--제품상태--","최상","상","중","하"];

// function MyCustomUploadAdapterPlugin(editor) {
//     editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
//         return new UploadAdapter(loader)
//     }
// }

// const useInput = (initialValue, validator, valid) => {
//     const [ value, setValue ] = useState(initialValue);
//     const onChange = (event) => {
//         const value = event.currentTarget.value;
//         let willUpdate = true;
//         if (typeof validator === "function") {
//             willUpdate = validator(value, valid);
//             if( willUpdate) {
//                 setValue(value);
//             }
//         }
//     }
//     return { value, onChange };
// }

// const maxLen = (value, valid) => ( value.length <= valid );

// const MarketWrite = () => {
//     return(
//         <div>
//              <CKEditorContext context={ Context }>
//                     <h2>Using the CKeditor 5 context feature in React</h2>
//                     <CKEditor
//                         editor={ ClassicEditor }
//                         config={ {
//                             plugins: [ Paragraph, Bold, Italic, Essentials ],
//                             toolbar: [ 'bold', 'italic' ]
//                         } }
//                         data="<p>Hello from the first editor working with the context!</p>"
//                         onReady={ editor => {
//                             // You can store the "editor" and use when it is needed.
//                             console.log( 'Editor1 is ready to use!', editor );
//                         } }
//                     />

//                     <CKEditor
//                         editor={ ClassicEditor }
//                         config={ {
//                             plugins: [ Paragraph, Bold, Italic, Essentials ],
//                             toolbar: [ 'bold', 'italic' ]
//                         } }
//                         data="<p>Hello from the second editor working with the context!</p>"
//                         onReady={ editor => {
//                             // You can store the "editor" and use when it is needed.
//                             console.log( 'Editor2 is ready to use!', editor );
//                         } }
//                     />gg
//                 </CKEditorContext>
//         </div>
//     );
// }

// export default MarketWrite;