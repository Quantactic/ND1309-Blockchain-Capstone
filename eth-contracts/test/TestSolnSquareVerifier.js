var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
let zKProof = require('../../zokrates/code/proof');

contract('TestSolnSquareVerifier', accounts => {
    const account1 = accounts[0];
    const account2 = accounts[1];

    beforeEach(async function () {
        this.contract = await SolnSquareVerifier.new({ from: account1 });
    })

    describe('solution square verifier test', function () {
        it('should be able to add a new solution', async function () {
            let to = account2;
            let input = [
                "0x0000000000000000000000000000000000000000000000000000000000000031",
                "0x0000000000000000000000000000000000000000000000000000000000000001"
            ];
            let proof = {
                "a": [
                    "0x1377e30d3afb75695ab470a2a382dc98f71171856bf236faf2f6b02aa6bdd765",
                    "0x10f984b561c82613590a0379452c26b68f6715ca48369299f1989101e0abe440"
                ],
                "b": [
                    [
                        "0x22b23a7eb29724f01df44c8c139d81c121b931261e2109222ce7791ed4fa62a7",
                        "0x1f1d1dc24516ddd73cbddf7c00322a134ee0a98c9fbe8626964d01dda0175f13"
                    ],
                    [
                        "0x130d383f596dfdbf631f6c821225b204cbc559fe0abfed4d7fecf2e41bd7ffe0",
                        "0x1d28067a4562f9309e4fea56588fe1395f846e09875cce194232fea436ba3bf6"
                    ]
                ],
                "c": [
                    "0x2fe0bd1a96f7da6e1ee1ddb026518de29429286c4fad2ee97cec11f13556c4e3",
                    "0x248a7d4e09ba87117453b607129756d3f21a7dc14f97c3a0ccd686fcce41092c"
                ]
            };
            let key = await this.contract.buildKey.call(to, proof.a, proof.b, proof.c, input);
            let CheckIfSolutionExists = await this.contract.CheckIfSolutionExists.call(key);
            assert.equal(CheckIfSolutionExists, false, "Solution already exists");

            await this.contract.addSolution(to, proof.a, proof.b, proof.c, input);
            CheckIfSolutionExists = await this.contract.CheckIfSolutionExists.call(key);
            assert.equal(CheckIfSolutionExists, true, "Solution was not added properly");
        })
    });

    it('ERC721 token can be minted for contract', async function () {
        let minted = true;
        try {
            await this.contract.mintNFT(
                account2, 
                2, 
                zKProof.proof.a,
                zKProof.proof.b,
                zKProof.proof.c,
                zKProof.inputs,
                { from: account1 }
            );
        }
        catch (e) {
            console.log(e);
            minted = false;
        }
        assert.equal(minted, true, "Solution wasn't minted");
    })
})