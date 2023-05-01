// 게시물작성
// CKEditor 사용
// import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";
// import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';


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