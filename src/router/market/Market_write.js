// // 게시물작성
// // CKEditor 사용
// import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";
// import { Context } from '@ckeditor/ckeditor5-core';
// import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
// import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
// import { Essentials } from '@ckeditor/ckeditor5-essentials';
// import { Paragraph } from '@ckeditor/ckeditor5-paragraph';

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