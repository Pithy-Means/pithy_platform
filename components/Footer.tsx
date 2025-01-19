import SocialMediaLinks from "./SocialMediaLinks";
import ContactInfo from "./ContactInfo";
import QuickLinks from "./QuickLinks";
import Logo from "./Logo";

const Footer = () => {
  return (
    <div className="bg-black ">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col md:flex-row h-auto md:h-96 w-full lg:flex-row">
          <div
            className="flex-1 bg-contain bg-no-repeat bg-left-bottom flex items-center justify-center text-white"
            style={{
              backgroundImage: "url('/assets/leftfooter.png')",
            }}
          />

          <div className="flex flex-col md:flex-row py-10 w-full md:w-4/5 space-x-4 md:items-start items-center md:space-x-6">
            <div className="flex flex-1 flex-col w-full md:w-1/5 mb-4 md:mb-0 md:items-start items-center">
              <div className="flex justify-between">
                <div className="flex flex-col space-y-4  md:items-start items-center md:-ml-8">
                  <div className="flex space-x-4 items-center">
                    <div className="p-1 rounded-full">
                      <Logo />
                    </div>
                  </div>
                  <p className="text-white text-[12px] md:text-[16px] lg:text-base md:text-start text-center break-normal">
                    Lorem psum aoka psuma lroe taray aoksa mdak djskas aso
                  </p>
                  <SocialMediaLinks className="text-white" />
                </div>
              </div>
            </div>

            <ContactInfo
              title={"Contact In USA"}
              location={
                "1309 Coffeen Avenue STE 10269, Sheridan, WY 82801, USA"
              }
              email={"contact@pithymeans.com"}
              phone={["+1 (307) 374-0993", " +1 (307) 205-5983"]}
              className="text-white text-center  mb-4 md:mb-0 break-normal md:text-base"
            />
            <ContactInfo
              title={"Contact In Africa"}
              location={
                "Plot No 546, ROFRA house, 4th Floor,Room No 2, Ggaba Road, Kansanga, Kampala."
              }
              email={"pithymeansafrica@gmail.com"}
              phone={[
                "+256 750 175 892",
                "+256 760 389 466",
                "+256 783 184 543",
              ]}
              className="text-white mb-4 md:mb-0 text-center break-normal "
            />
            <QuickLinks />
          </div>
          <div
            className="flex-1 bg-contain bg-no-repeat bg-right-top flex items-center justify-center text-white"
            style={{
              backgroundImage: "url('/assets/rightfooter.png')",
            }}
          />
        </div>
        <div className="w-full mt-8">
          <div className="">
            <div className="mx-4 border border-gray-600 "></div>
            <div className="flex justify-between flex-col-reverse md:flex-row items-center px-4 md:px-10">
              <div>
                <p className="text-white text-center py-4 text-[18px]">
                  © 2024 Pithy Means. All Rights Reserved
                </p>
              </div>
              <div className="flex space-x-2 md:space-x-4 items-center">
                <p className="text-[18px]">Privacy Policy</p>
                <div className="w-0.5 h-4 bg-gray-600"></div>
                <p className="text-[18px]">Help</p>
                <div className="w-0.5 h-4 bg-gray-600"></div>
                <p className="text-[18px]">Terms and Conditions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
