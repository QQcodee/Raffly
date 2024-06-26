// src/components/ImageGrid.js
const ImageGrid = ({ images, onDelete }) => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
        {images.map((image, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <img
              src={image.publicURL}
              alt={`Preview ${index + 1}`}
              style={{ maxWidth: '100%', maxHeight: '100px' }}
            />
            <button
              onClick={() => onDelete(image.filePath)}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            >
              X
            </button>         
          </div>
        ))}
      </div>
    );
  };
  
  export default ImageGrid;
  