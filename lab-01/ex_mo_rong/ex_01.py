import itertools


lst = [1, 2, 3]

hoan_vi = list(itertools.permutations(lst))


for hv in hoan_vi:
    print(hv)
