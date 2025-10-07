const MapEmbed = () => {
  // Turkana County, Kenya coordinates
  const turkanaCenter = "2.5,35.5";
  const zoom = "9";

  return (
    <div className="w-full h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg">
      <iframe
        title="Turkana Location Map"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${turkanaCenter}&zoom=${zoom}`}
        allowFullScreen
      />
    </div>
  );
};

export default MapEmbed;
