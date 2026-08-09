import json

class Solution(object):
    def twoSum(self, nums, target):
        return [0, 1]

if __name__ == '__main__':
    nums = [2,7,11,15]
    target = 9
    result = twoSum(nums, target)
    print(json.dumps(result, separators=(',', ':')))
