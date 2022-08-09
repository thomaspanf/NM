pragma solidity 0.8.0;

contract test {
    uint256 public recentVolumePointer = 1;
    uint256[] public recentVolume = [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0];

    //122267 gas, multiple state reads 
    function loop1() public view {
        uint256 hourlyVolume = 0;
        for (uint256 i = recentVolumePointer; i < recentVolume.length; ++i) {
            hourlyVolume += recentVolume[i];
        }
    }
    //118469 gas, rvlength and rvPointer declared as local variables 
    function loop2() public view {
        uint256 rvLength = recentVolume.length;
        uint256 rvPointer = recentVolumePointer;
        uint256 hourlyVolume = 0;
        for (uint256 i = rvPointer; i < rvLength; ++i) {
            hourlyVolume += recentVolume[i];
        }
    }
    //118434 gas, rvLength declared as local variable 
    function loop3() public view {
        uint256 rvLength = recentVolume.length;
        uint256 hourlyVolume = 0;
        for (uint256 i = recentVolumePointer; i < rvLength; ++i) {
            hourlyVolume += recentVolume[i];
        }
    }
}
