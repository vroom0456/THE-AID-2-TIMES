// src/utils/resourceManager.js
export const getResKey = (reg, branch, sem, code) => `aid2_res_${reg}_${branch}_${sem}_${code}`;

export const saveSubjectResources = (reg, branch, sem, sub) => {
  const key = getResKey(reg, branch, sem, sub.code);
  localStorage.setItem(key, JSON.stringify({
    theory: sub.resources.theory,
    pyp: sub.resources.pyp,
    lab: sub.resources.lab
  }));
};
